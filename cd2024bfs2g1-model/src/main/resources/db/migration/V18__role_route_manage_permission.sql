UPDATE public.usr_role
SET rol_json_client_permission='{"menu":[{"attr":"admin","visible":false,"enabled":false},{"attr":"packs-public","visible":false,"enabled":false},{"attr":"businesses-public","visible":false,"enabled":false},{"attr":"businessesmd","visible":false,"enabled":false},{"attr":"routes-public","visible":false,"enabled":false},{"attr":"routesmd","visible":false,"enabled":false},{"attr":"packsnew","visible":false,"enabled":false},{"attr":"packssolo","visible":false,"enabled":false},{"attr":"graphics","visible":false,"enabled":false},{"attr":"managepacks","visible":false,"enabled":false},{"attr":"home-public","visible":false,"enabled":false}],"routes":[{"permissionId":"BusinessNew","enabled":false},{"permissionId":"myBusiness","enabled":false},{"permissionId":"myBusinessDetail","enabled":false},{"permissionId":"RoutesNew","enabled":false},{"permissionId":"PacksNew","enabled":false},{"permissionId":"graphics","enabled":false},{"permissionId":"mybusinesses","enabled":false},{"permissionId":"admin","enabled":false},{"permissionId":"managepacks","enabled":false},{"permissionId":"home-public","enabled":false},{"permissionId":"manageroutes","enabled":false},{"permissionId":"manageroutesedit","enabled":false},{"permissionId":"managerlandmarkadd","enabled":false}]}'
WHERE rol_name='client';

UPDATE public.usr.role
SET rol_json_client_permission='{"menu":[{"attr":"admin","visible":false,"enabled":false},{"attr":"mypacks","visible":false,"enabled":false},{"attr":"packs-public","visible":false,"enabled":false},{"attr":"routes-public","visible":false,"enabled":false},{"attr":"businesses-public","visible":false,"enabled":false},{"attr":"businessessolo","visible":false,"enabled":false},{"attr":"routesmd","visible":false,"enabled":false},{"attr":"packmd","visible":false,"enabled":false},{"attr":"graphics","visible":false,"enabled":false},{"attr":"managepacks","visible":false,"enabled":false},{"attr":"home-public","visible":false,"enabled":false}],"routes":[{"permissionId":"RoutesNew","enabled":false},{"permissionId":"PacksNew","enabled":false},{"permissionId":"graphics","enabled":false},{"permissionId":"my-clients-permissions","enabled":false},{"permissionId":"admin","enabled":false},{"permissionId":"managepacks","enabled":false},{"permissionId":"home-public","enabled":false},{"permissionId":"manageroutes","enabled":false},{"permissionId":"manageroutesedit","enabled":false},{"permissionId":"managerlandmarkadd","enabled":false}],"components":[{"attr":"packDetail","selector":"o-form","components":[{"attr":"reserve-container","visible":false,"enabled":false}]}]}'
WHERE rol_name='merchant';