import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class PantallaOperaciones extends React.Component {
    render(){
        return <div className={'pantallaOperaciones'+(this.props.resultado!=0 ? ' show' : '')}>{this.props.operacion}</div>
    }
}
class PantallaResultado extends React.Component {
    render(){
        return <div className='pantallaResultado'>{this.props.resultado}</div>
    }
}

function Tecla (props) {
        return <button type='button' onClick={props.onClick} id={props.id} className={'button '+props.tipo}>{props.id}</button>
}

function Historico (props) {

    let historico = props.operaciones.map((element,index) => {
        return <div id={'historico_'+index}className='elementoHistorial' onClick={(index) => props.goBack(index)}>
            {element + ' = ' +props.resultados[index]}
        </div>
    });

    return <div className={'historico'}>{historico}</div>
}


class Calculadora extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            operacion: '',
            resultadoMostrar: 0,
            resultadoIntermedio: 0,
            historicoResultados: [],
            historicoOperacion: [],
            ultimoOperador:'',
            ultimoCaracter:'',
            ultimoNumero:'',
            operadores:[],
            numeros:[]
        }
    }

    renderButton(i,operator){
        let tipo = (operator !== undefined && operator === true) ? 'operator' : 'number';
        if(i==='='){
            tipo = tipo.concat(' equals');
        }else if(i==='÷'){
            i = '/';
        }
        return <Tecla id={i} tipo={tipo} onClick={()=>this.handleClick(i)}></Tecla>
    }

    handleClick(i){
        console.log(i)

        if(i==='C'){
            this.resetCalculator()
            return;
        
        }else if(i==='=' && this.state.ultimoCaracter==='='){
            return

        // Si se introduce un operador y no hay nada
        }else if(this.state.operacion==="" && this.isOperator(i)){

        // Si se introduce un operador, y el ultimo caracter es un numero
        }else if(this.isOperator(i) && (!this.isOperator(this.state.ultimoCaracter)
                    || this.state.ultimoCaracter==='=')){
                        
            this.setState({operacion:this.state.operacion+i});
            this.addNumber();
            this.addOperator(i);

            if(i==='='){
                this.resultadoFinal()
            }

            if(this.state.resultadoMostrar!==0)this.setState({resultadoIntermedio:this.state.resultadoMostrar})
            
            
        // Si se introduce un operador, y el ultimo caracter es un operador (se sobreescribe)
        }else if(this.isOperator(this.state.ultimoCaracter) && this.isOperator(i) 
                && this.state.ultimoCaracter!=='='){
                    
            this.setState({operacion:this.state.operacion.replace(/.$/,i)});
            this.changeOperator(i);

        // Si se introduce un numero
        }else if(!this.isOperator(i)){
            console.log('se introduce parte de un numero')
            let ultimoNumeroAux = this.state.ultimoNumero+i
            this.setState({operacion:this.state.operacion+i});
            this.setState({ultimoNumero: ultimoNumeroAux})

            // Si se introducuce un numero despues de un operador (salvo el -)
            if(this.state.numeros.length>0 && this.state.operadores.length>0 && !this.isOperator(i) && i!=='.'){
                let res = this.doOperation(this.state.resultadoIntermedio,ultimoNumeroAux,this.state.operadores[this.state.operadores.length-1])
                console.log(res)
                this.setState({ultimoResultado:res})
                this.setState({resultadoMostrar:res})
            }
        }
        
        if(this.state.numeros.length===1 && this.state.resultadoIntermedio===0){
            this.setState({resultadoIntermedio:this.state.numeros[0]})
        }
        
        this.setState({ultimoCaracter:i})
    }

    isOperator(char){
        return (char==='+' || char==='-' || char==='/' || char==='x' || char==='=' 
                || char==='%' || char==='DEL')
    }

    doOperation(ultimoResultado,numeroNuevo,operador){
        console.log(ultimoResultado + '  ' + numeroNuevo + '  ' + operador)
        
        switch(operador){
            case '+':
                return parseFloat(ultimoResultado) + parseFloat(numeroNuevo);
            case '-':
                return parseFloat(ultimoResultado) - parseFloat(numeroNuevo);
            case '/':
                return parseFloat(ultimoResultado) / parseFloat(numeroNuevo);
            case 'x':
                return parseFloat(ultimoResultado) * parseFloat(numeroNuevo);
            case '%':
                return (parseFloat(ultimoResultado) / 100) * parseFloat(numeroNuevo);
        }
    }

    resetCalculator(){
        this.setState({
            operacion: '',
            resultadoIntermedio: 0,
            resultadoMostrar: 0,
            ultimoOperador:'',
            ultimoCaracter:'',
            ultimoNumero:'',
            operadores:[],
            numeros:[],
            historicoOperacion:[],
            historicoResultados:[]
        })
    }

    resultadoFinal(){
        let historicoOperacionAux = this.state.historicoOperacion;
        historicoOperacionAux.push(this.state.operacion);

        let historicoResultadosAux = this.state.historicoResultados;
        historicoResultadosAux.push(this.state.resultadoMostrar);

        this.setState({
            historicoOperacion: historicoOperacionAux,
            historicoResultados: historicoResultadosAux,
            operacion:this.state.resultadoMostrar,
            resultadoMostrar:0
            })
    }

    addNumber(){
        let numerosAux = this.state.numeros;
        numerosAux.push(this.state.ultimoNumero);
        this.setState({numeros:numerosAux,ultimoNumero:''});
    }

    addOperator(operator){
        let operadoresAux = this.state.operadores;
        operadoresAux.push(operator);
        this.setState({operadores:operadoresAux,ultimoOperador:operator});
    }

    changeOperator(operator){
        let operadoresAux = this.state.operadores;
        operadoresAux.pop();
        operadoresAux.push(operator);
        this.setState({operadores:operadoresAux,ultimoOperador:operator});
    }

    goBack(event){
        let index = event.target.id.substring(10);
        console.log(index)
        if(index>-1){
            this.setState({
                historicoOperacion: this.state.historicoOperacion.filter((x,i) => i<= index),
                historicoResultados: this.state.historicoResultados.filter((x,i) => i<= index),
                operacion: this.state.historicoOperacion[index],
                resultadoMostrar: this.state.historicoResultados[index]
            });
        }
    }
    
    render(){
        return (
            <div className='calculadora'>
                <div className='pantallas'>
                    <PantallaOperaciones operacion={this.state.operacion} resultado={this.state.resultadoMostrar}></PantallaOperaciones>
                    <PantallaResultado resultado={this.state.resultadoMostrar}></PantallaResultado>
                </div>
                <div className='historicoContenedor'>
                    <Historico operaciones={this.state.historicoOperacion} 
                            resultados={this.state.historicoResultados}
                            goBack={this.goBack.bind(this)}></Historico>
                    <div className='espacioHistorico'></div>
                </div>
                <div className='teclado'>
                    <div className='fila'>
                        {this.renderButton('C')}
                        {this.renderButton('%',true)}
                        {this.renderButton('÷',true)}
                    </div>
                    <div className='fila'>
                        {this.renderButton(7)}
                        {this.renderButton(8)}
                        {this.renderButton(9)}
                        {this.renderButton('x',true)}
                    </div>
                    <div className='fila'>
                        {this.renderButton(4)}
                        {this.renderButton(5)}
                        {this.renderButton(6)}
                        {this.renderButton('-',true)}
                    </div>
                    <div className='fila'>
                        {this.renderButton(1)}
                        {this.renderButton(2)}
                        {this.renderButton(3)}
                        {this.renderButton('+',true)}
                    </div>
                    <div className='fila'>
                        {this.renderButton('.')}
                        {this.renderButton(0)}
                        {this.renderButton('=',true)}
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Calculadora />,
    document.getElementById('root')
);