#!/bin/bash

# SSL Setup Script for perps.gautamtayal.com
# Run this on the VM after first deployment

DOMAIN="perps.gautamtayal.com"
EMAIL="admin@gautamtayal.com"  # Change this to your email

# Step 1: Use initial nginx config (HTTP only)
echo "Setting up initial nginx config for SSL certificate generation..."
cp nginx/nginx-initial.conf nginx/nginx.conf.backup
cp nginx/nginx-initial.conf nginx/nginx-active.conf

# Create docker-compose override for initial setup
cat > docker-compose.override.yml << EOF
services:
  nginx:
    volumes:
      - ./nginx/nginx-initial.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
EOF

# Step 2: Start nginx with initial config
echo "Starting nginx..."
docker compose up -d nginx

# Wait for nginx to start
sleep 5

# Step 3: Get SSL certificate
echo "Requesting SSL certificate for $DOMAIN..."
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN

# Step 4: Remove override and use full SSL config
rm docker-compose.override.yml

# Step 5: Restart nginx with SSL config
echo "Restarting nginx with SSL configuration..."
docker compose restart nginx

echo "SSL setup complete! Your site should now be available at https://$DOMAIN"
