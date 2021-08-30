import React, { Component } from 'react';
import './App.css';
import {TareaService} from './service/TareaService';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Panel} from 'primereact/panel';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Menubar} from 'primereact/menubar';
import {Button} from 'primereact/button';
import {Checkbox} from 'primereact/checkbox';
import {Toast} from 'primereact/toast';
/*

*/

import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class App extends Component{
  constructor(){
    super();
    this.state = {
      visible : false,
      tarea:{
        identificador: '',
        descripcion: '',
        fechaCreacion: '',
        vigente: false
      },
      tareaSeleccionada : {

      }

    };

    this.actions = [
      {
        label : 'Nueva',
        icon  : 'pi pi-fw pi-plus',
        command : () => {this.showGuardarDialog()}
      },
      {
        label : 'Actualizar',
        icon  : 'pi pi-fw pi-pencil',
        command : () => {this.showActualizarDialog()}
      },
      {
        label : 'Eliminar',
        icon  : 'pi pi-fw pi-trash',
        command : () => {this.eliminar()}
      }
    ];

    this.tareaService = new TareaService();
    this.agregar = this.agregar.bind(this);
    this.eliminar = this.eliminar.bind(this);

    this.footer = (
      <div>
        <Button label="Guardar" icon="pi pi-check" onClick={this.agregar} />
      </div>
    );
    
  }

  componentDidMount(){
    this.tareaService.listar().then(data => this.setState({tareas: data}))
  }

  agregar(){
    this.tareaService.agregar(this.state.tarea).then(data => {
      this.setState({
        visible : false,
        tarea:{
          identificador: '',
          descripcion: '',
          vigente: false
        }
      });
      
      this.toast.current.show({severity: 'success', summary: 'Atención', detail: 'Se guardó la tarea correctamente'});
      this.personaService.listar().then(data => this.setState({tareas: data}))
    })
  }

  eliminar() {
    if(window.confirm("¿Realmente desea eliminar la tarea?")) {
      this.tareaService.eliminar(this.state.tareaSeleccionada.identificador).then(data => {
        this.personaService.listar().then(data => this.setState({tareas: data}));
      });
    }
  }

  onChange = e =>{
      this.setState({
          [e.target.name]:e.target.value
      })
  }
  
  render(){
    return (
      <div style={{width:'80%', margin: '0 auto', marginTop: '20px'}}>
        <Menubar model={this.actions}/>
        <br/>
        <Panel header="Mantenedor de tareas."  >
          <DataTable 
            value={this.state.tareas}
            paginator={true} 
            rows="4"
            selectionMode="single"
            selection={this.state.tareaSeleccionada} 
            onSelectionChange={e => this.setState({tareaSeleccionada: e.value})}>
            <Column field="identificador" header="Identificador" />
            <Column field="descripcion" header="Descripcion" />
            <Column field="fechaCreacion" header="Fecha de Creacion" />
            <Column field="vigente" header="Vigente" selectionMode="multiple" />
          </DataTable>
        </Panel>

        <Dialog 
          header="Informacion de tarea" 
          visible={this.state.visible} 
          style={{width: '300px'}} 
          footer={this.footer}
          modal={true} 
          onHide={() => this.setState({visible: false})} >
            <form id="tarea-form" >

              <span className="p-float-label">
                <InputText value={this.state.tarea.identificador} style={{width : '80%'}} id="identificador" onChange={(e) => {
                    let val = e.target.value;
                    this.setState(prevState => {
                        let tarea = Object.assign({}, prevState.tarea);
                        tarea.identificador = val;
                        return {tarea};
                    })}
                  } />
                <label htmlFor="identificador">Identificador</label>
              </span>
              <br/>

              <span className="p-float-label">
                <InputText value={this.state.tarea.descripcion} style={{width : '100%'}} id="descripcion" onChange={(e) => {
                    let val = e.target.value;
                    this.setState(prevState => {
                        let tarea = Object.assign({}, prevState.tarea);
                        tarea.descripcion = val
                        return {tarea};
                    })}
                  } />
                <label htmlFor="descripcion">Descripcion</label>
              </span>
              <br/>
              <label htmlFor="vigente">Vigente</label>
              <Checkbox checked={this.state.tarea.vigente} onChange={(e) => {
                  let val = e.target.checked;
                  this.setState(prevState => {
                      let tarea = Object.assign({}, prevState.tarea);
                      tarea.vigente = val
                      return {tarea};
                  })}
                } />
              
            </form>
        </Dialog>
        <Toast ref={this.toast} />
      </div>
    );
  }

  showGuardarDialog(){
    this.setState({
      visible : true,
      tarea:{
        identificador: '',
        descripcion: '',
        fechaCreacion: '',
        vigente: false
      }
    });
    
  }

  showActualizarDialog() {
    this.setState({
      visible : true,
      tarea : {
        identificador: this.state.tareaSeleccionada.identificador,
        descripcion: this.state.tareaSeleccionada.descripcion,
        vigente: this.state.tareaSeleccionada.vigente
      }
    })
  }

  
}