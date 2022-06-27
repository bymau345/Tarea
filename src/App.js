import React, { useState, useEffect } from 'react';
import './App.css';
import MaterialTable from "material-table";
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';



const columns= [
  { title: 'Detalle', field: 'detalle' },
  { title: 'Autor', field: 'autor' },
  
];
const baseUrl="http://localhost:3001/Autores";


const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
  const styles= useStyles();
  const [data, setData]= useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [artistaSeleccionado, setArtistaSeleccionado]=useState({
    id: "",
    detalle: "",
    autor: ""
    
    
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setArtistaSeleccionado(prevState=>({
      ...prevState,
      [name]: value
    }));
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
     setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    await axios.post(baseUrl, artistaSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+"/"+artistaSeleccionado.id, artistaSeleccionado)
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(artista=>{
        if(artista.id===artistaSeleccionado.id){
          artista.artista=artistaSeleccionado.artista;
          artista.genero=artistaSeleccionado.genero;
          artista.ventas=artistaSeleccionado.ventas;
          artista.pais=artistaSeleccionado.pais;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+artistaSeleccionado.id)
    .then(response=>{
      setData(data.filter(artista=>artista.id!==artistaSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarArtista=(artista, caso)=>{
    setArtistaSeleccionado(artista);
    (caso==="Editar")?abrirCerrarModalEditar()
    :
    abrirCerrarModalEliminar()
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  useEffect(()=>{
    peticionGet();
  }, [])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nuevo Artista</h3>
      <TextField className={styles.inputMaterial} label="Detalle" name="detalle" onChange={handleChange}/>
      <br />
      <TextField className={styles.inputMaterial} label="Autor" name="autor" onChange={handleChange}/>          
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Artista</h3>
      <TextField className={styles.inputMaterial} label="Detalle" name="detalle" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.artista}/>
      <br />
      <TextField className={styles.inputMaterial} label="Autor" name="autor" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.pais}/>          
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar al artista <b>{artistaSeleccionado && artistaSeleccionado.artista}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()}>Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )

  return (
    <div className="App">
      <br />
      <Button onClick={()=>abrirCerrarModalInsertar()}>Insertar Artista</Button>
      <br /><br />
      <h1 className="listar"> Listar Tesis</h1>
     <MaterialTable
          columns={columns}
          data={data}
          title="Lista" 
          actions={[
            {
              icon: 'edit',
              tooltip: 'Editar Detalle',
              onClick: (event, rowData) => seleccionarArtista(rowData, "Editar")
            },
            {
              icon: 'delete',
              tooltip: 'Eliminar Detalle',
              onClick: (event, rowData) => seleccionarArtista(rowData, "Eliminar")
            }
          ]}
          options={{
            actionsColumnIndex: -1,
          }}
          localization={{
            header:{
              actions: "Acciones"
            }
          }}
          
        />


        <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}>
          {bodyInsertar}
        </Modal>

        
        <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}>
          {bodyEditar}
        </Modal>

        <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
          {bodyEliminar}
        </Modal>
    </div>
  );
}

export default App;
