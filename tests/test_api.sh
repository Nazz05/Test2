#!/bin/bash

echo "Testing Backend API..."
echo "======================================"

# Test 1: Simple register request
echo "1. Testing Register..."
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser1","email":"test1@example.com","password":"test123"}' \
  -v

echo ""
echo "======================================"
echo "Test Complete"
