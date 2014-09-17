Libris-Sdk partner node implementation
======================================

Reference implementation of the libris-sdk partner api in node.js

Install heroku toolbelt
> wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh


> npm install



## Test
- `foreman start`; foreman is part of the heroku toolbelt installation. It will pick up the command from the ./Procfile

## Deployment 
-  commit changes into the git master repository
- `git push heroku master`
- `heroku logs`; show the logs on the server
- `heroku open`; open the browser


 heroku config:set URL_LIBRIS_SDK="//stage.bluelibris.com/static/js/libris-sdk.js"
 heroku config:set LIBRIS_APP_KEY="f45b4abebfed8066804b11a2ac8c7117"
 heroku config:set LIBRIS_APP_ID="libris-contoso"

