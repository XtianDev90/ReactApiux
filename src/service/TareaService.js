import axios from 'axios';

export class TareaService{
    urlBase = "http://localhost:8010/tareas/";

    listar(){
        return axios.get(this.urlBase + "listar").then(res => res.data);
    }

    agregar(tarea){
        return axios.post(this.urlBase + "agregar", tarea).then(res => res.data);
    }

    eliminar(identificador){
        return axios.get(this.urlBase + "eliminar/" + identificador).then(res => res.data);
    }

}