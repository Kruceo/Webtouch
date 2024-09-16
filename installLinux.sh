sudo echo "Initiating..."

node -v
if [ $? -eq 0 ]; then
  echo "Trying with NodeJS"
  RUNTIME=/bin/node
  PM=npm
  ARGS="--loader=ts-node/esm"
  npm install ts-node

else 
  RUNTIME="/home/$(whoami)/.bun/bin/bun"
  PM=bun
  ARGS=""
  echo "Trying with BunJS, but BunJS is not fully supported"
fi

bash -c "$RUNTIME -v"

if [ $? -ne 0 ]; then
  echo "Problem with runtime: $RUNTIME"
  exit 1
fi

INSTALL_PATH="/home/$(whoami)/.webtouch"

bash -c "$PM install"

bash -c "$PM run build "

mkdir            "$INSTALL_PATH"
mkdir            "$INSTALL_PATH/dist"
mkdir            "$INSTALL_PATH/server"
mv dist/*        "$INSTALL_PATH/dist"
cp server/*      "$INSTALL_PATH/server"
cp tsconfig.json "$INSTALL_PATH/tsconfig.json"
cp package.json  "$INSTALL_PATH/package.json"
cp config.json   "$INSTALL_PATH/config.json"

cd "$INSTALL_PATH"

# bash -c "sudo NODE_ENV=production $RUNTIME $ARGS /opt/webtouch/server/index.ts"

echo [Unit]                                             >  /tmp/webtouch.service
echo "Description=Webtouch Service"                     >> /tmp/webtouch.service
echo "After=network.target"                             >> /tmp/webtouch.service
echo ""                                                 >> /tmp/webtouch.service
echo [Service]                                          >> /tmp/webtouch.service
echo "ExecStart=$RUNTIME $ARGS $INSTALL_PATH/server/index.ts" >> /tmp/webtouch.service
echo "WorkingDirectory=$INSTALL_PATH"                   >> /tmp/webtouch.service
echo "Restart=always"                                   >> /tmp/webtouch.service
echo "RestartSec=10"                                    >> /tmp/webtouch.service
echo "User=$(whoami)"                                   >> /tmp/webtouch.service
echo "Environment=PORT=3000 NODE_ENV=production"        >> /tmp/webtouch.service
echo "StandardOutput=syslog"                            >> /tmp/webtouch.service
echo "StandardError=syslog"                             >> /tmp/webtouch.service
echo ""                                                 >> /tmp/webtouch.service
echo [Install]                                          >> /tmp/webtouch.service
echo WantedBy=multi-user.target                         >> /tmp/webtouch.service

mv /tmp/webtouch.service "$INSTALL_PATH/webtouch.service"

sudo rm  /etc/systemd/system/webtouch.service
sudo ln -s "$INSTALL_PATH/webtouch.service" "/etc/systemd/system/webtouch.service"

