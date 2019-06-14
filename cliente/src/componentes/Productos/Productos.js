import React, { Component } from 'react';
import Producto from '../Producto/Producto';
import Buscador from '../Buscador/Buscador';
import './Productos.css';
import axios from 'axios';

class Productos extends Component {
  state = {
    productos : [],
    terminoBusqueda : ''
  }

  componentWillMount() {
    this.queryAPI()
  }

  queryAPI = () =>{
    //console.log(this.props.auth.getAccessToken())
    const { getAccessToken} = this.props.auth;

    const headers = {"Authorization": `Bearer ${getAccessToken() }`}
    const url = 'http://localhost:5000/productos';

    return axios.get(url, {headers})
            .then(respuesta => this.setState({productos: respuesta.data  }));
  }

  login = () =>{
    this.props.auth.login();
  }

  busquedaProducto = (busqueda) => {
    if(busqueda.length > 3) {

      //obetener copia del state
      let producto = [...this.state.productos];
      
      //filtrar
      let resultado;
      resultado = producto.filter(producto => (
        producto.nombre.toLowerCase().indexOf( busqueda.toLowerCase()  ) !== -1
      ))

      //enviar al state los productos filtrados y la busqueda

      this.setState({
        terminoBusqueda : busqueda,
        productos : resultado
      })
    } else {
      this.setState({
        terminoBusqueda: ''
      }, () =>{
        this.queryAPI()
      })
    }
  }

  render() { 
    const {isAuthenticated} = this.props.auth;
    return ( 
      <div className="productos">
        { isAuthenticated() && (
          <React.Fragment>
            <h2>Nuestros Productos</h2>
            <Buscador
              busqueda={this.busquedaProducto}
            />
            <ul className="lista-productos">
              {Object.keys(this.state.productos).map(producto =>(
                <Producto
                  informacion = {this.state.productos[producto]}
                  key = {producto}
                />
              ))}
            </ul>
          </React.Fragment>
        )}
        { !isAuthenticated() && (
          <div className="contenedor-boton">
            <p>Para ver contenido debes estar logueado</p>
            <a className="boton" onClick={this.login}>Iniciar Sesion</a>
          </div>
        )}
      </div>
    )
  }
}
 
export default Productos;