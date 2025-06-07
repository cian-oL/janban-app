#!/bin/bash

# Exit on any error
set -e

# Validate input
if [ -z "$1" ]; then
    echo "Error: Username required"
    echo "Usage: $0 <username>"
    exit 1
fi

USER=$1
FRONTEND_TARGET_DIR="/var/www/janban-app/frontend"
BACKEND_TARGET_DIR="/home/$USER/janban-app/backend"
DEPLOY_ARTIFACT_DIR="/home/$USER/janban-deploy/artifacts"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=== Starting Deployment at $(date) ==="
echo "User: $USER"
echo "Frontend Target: $FRONTEND_TARGET_DIR"
echo "Backend Target: $BACKEND_TARGET_DIR"
echo "Artifacts Source: $DEPLOY_ARTIFACT_DIR"

# Validate artifact directory exists
if [ ! -d "$DEPLOY_ARTIFACT_DIR" ]; then
    echo "Error: Artifact directory not found: $DEPLOY_ARTIFACT_DIR"
    exit 1
fi

if [ ! -d "$DEPLOY_ARTIFACT_DIR/frontend" ] || [ ! -d "$DEPLOY_ARTIFACT_DIR/backend" ]; then
    echo "Error: Frontend or backend artifacts not found"
    exit 1
fi

echo "=== Frontend Deployment ==="

# Create backup if frontend exists
if [ -d "${FRONTEND_TARGET_DIR}" ] && [ "$(ls -A ${FRONTEND_TARGET_DIR} 2>/dev/null)" ]; then
    echo "Creating frontend backup..."
    cp -r ${FRONTEND_TARGET_DIR} ${FRONTEND_TARGET_DIR}.backup.${TIMESTAMP}
fi

# Ensure frontend target directory exists
mkdir -p ${FRONTEND_TARGET_DIR}

# Replace frontend directory
echo "Removing old frontend files..."
rm -rf ${FRONTEND_TARGET_DIR}/*

echo "Copying new frontend files..."
cp -r ${DEPLOY_ARTIFACT_DIR}/frontend/* ${FRONTEND_TARGET_DIR}/

# Validate frontend deployment
if [ ! -d "${FRONTEND_TARGET_DIR}" ] || [ -z "$(ls -A ${FRONTEND_TARGET_DIR})" ]; then
    echo "Error: Frontend deployment failed - directory empty"
    exit 1
fi

echo "Frontend deployment complete"

echo "=== Backend Deployment ==="

# Create backup if backend exists
if [ -d "${BACKEND_TARGET_DIR}" ] && [ "$(ls -A ${BACKEND_TARGET_DIR} 2>/dev/null)" ]; then
    echo "Creating backend backup..."
    cp -r ${BACKEND_TARGET_DIR} ${BACKEND_TARGET_DIR}.backup.${TIMESTAMP}
fi

# Ensure backend target directory exists
mkdir -p ${BACKEND_TARGET_DIR}

# Replace backend directory
echo "Removing old backend files..."
rm -rf ${BACKEND_TARGET_DIR}/*

echo "Copying new backend files..."
cp -r ${DEPLOY_ARTIFACT_DIR}/backend/* ${BACKEND_TARGET_DIR}/
cp ${DEPLOY_ARTIFACT_DIR}/backend/.env ${BACKEND_TARGET_DIR}/.env

# Set appropriate permissions
echo "Setting backend permissions..."
chgrp app_devs -R ${BACKEND_TARGET_DIR}
chmod 775 -R ${BACKEND_TARGET_DIR}

# Validate backend deployment
if [ ! -d "${BACKEND_TARGET_DIR}" ] || [ -z "$(ls -A ${BACKEND_TARGET_DIR})" ]; then
    echo "Error: Backend deployment failed - directory empty"
    exit 1
fi

# Validate required files exist
if [ ! -f "${BACKEND_TARGET_DIR}/package.json" ]; then
    echo "Error: package.json not found in backend deployment"
    exit 1
fi

if [ ! -f "${BACKEND_TARGET_DIR}/.env" ]; then
    echo "Warning: .env file not found in backend deployment"
fi

echo "=== Backend Setup ==="

# Install dependencies (run as the user, not root)
echo "Installing production dependencies..."
cd ${BACKEND_TARGET_DIR}
sudo -u $USER npm ci --omit=dev

# Validate node_modules was created
if [ ! -d "${BACKEND_TARGET_DIR}/node_modules" ]; then
    echo "Error: npm install failed - node_modules not created"
    exit 1
fi

echo "Backend deployment complete"

echo "=== Restart Services ==="

# Check if PM2 process exists and restart/start accordingly
echo "Managing PM2 process..."
if sudo -u $USER pm2 list | grep -q "janban-backend"; then
    echo "Restarting existing PM2 process..."
    sudo -u $USER pm2 restart janban-backend
else
    echo "Starting new PM2 process..."
    if [ ! -f "${BACKEND_TARGET_DIR}/dist/index.js" ]; then
        echo "Error: src/index.js not found - cannot start PM2 process"
        exit 1
    fi
    sudo -u $USER pm2 start src/index.js --name janban-backend
fi

# Restart nginx
echo "Restarting nginx..."
systemctl restart nginx

# Verify nginx is running
if ! systemctl is-active --quiet nginx; then
    echo "Error: nginx failed to restart"
    systemctl status nginx
    exit 1
fi

echo "=== Deployment Complete ==="
echo "Services restarted successfully at $(date)"
echo "PM2 Status:"
sudo -u $USER pm2 list

# Clean up old backups (keep last 3)
echo "=== Cleanup ==="
if ls ${FRONTEND_TARGET_DIR}.backup.* >/dev/null 2>&1; then
    echo "Cleaning up old frontend backups..."
    ls -t ${FRONTEND_TARGET_DIR}.backup.* | tail -n +4 | xargs -r rm -rf
fi

if ls ${BACKEND_TARGET_DIR}.backup.* >/dev/null 2>&1; then
    echo "Cleaning up old backend backups..."
    ls -t ${BACKEND_TARGET_DIR}.backup.* | tail -n +4 | xargs -r rm -rf
fi

echo "Deployment completed successfully"