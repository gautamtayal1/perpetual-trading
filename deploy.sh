#!/bin/bash
set -e

# Deployment script for Perpetual Trading Platform
# Usage: ./deploy.sh <VM_IP>

VM_IP=${1:-$(curl -s ifconfig.me 2>/dev/null || echo "localhost")}

echo "=========================================="
echo "Deploying Perpetual Trading Platform"
echo "VM IP: $VM_IP"
echo "=========================================="

# Update .env.prod with the VM IP
sed -i.bak "s|YOUR_VM_IP|$VM_IP|g" .env.prod
sed -i.bak "s|http://localhost:8080|http://$VM_IP:8080|g" .env.prod
sed -i.bak "s|ws://localhost:8081|ws://$VM_IP:8081|g" .env.prod

# Export for docker-compose
export NEXT_PUBLIC_API_URL="http://$VM_IP:8080"
export NEXT_PUBLIC_WSS_URL="ws://$VM_IP:8081"

echo "Building and starting services..."
docker compose down --remove-orphans 2>/dev/null || true
docker compose build --no-cache
docker compose up -d

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Services running:"
echo "  - Web:        http://$VM_IP:3000"
echo "  - API:        http://$VM_IP:8080"
echo "  - WebSocket:  ws://$VM_IP:8081"
echo "  - Redis UI:   http://$VM_IP:8001"
echo ""
echo "To view logs: docker compose logs -f"
echo "To stop:      docker compose down"
