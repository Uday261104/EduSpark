import { permission } from "process";

class Authorization{
    private permissionMap: Record<string,boolean>={};

    initialize(permissions: string[]){
        this.permissionMap={};
    

    permissions.forEach((permission)=>{
        this.permissionMap[permission]=true;
    });

    localStorage.setItem(
        "permissionMap",
        JSON.stringify(this.permissionMap)
    );}

    loadFromStorage(){
        const stored = localStorage.getItem("permissionMap");
        this.permissionMap=stored?JSON.parse(stored):{};
    }

    isAuthorized(permission:string):boolean{
        return !!this.permissionMap[permission];
    }

    clear(){
        this.permissionMap={};
        localStorage.removeItem("permissionMap");
    }

}

const authorization = new Authorization();

export default authorization;