import {useEffect, useState} from 'react';
import { auth, storage, db } from './firebase.js';
import './firebase.js';
import firebase from 'firebase';

function Header(props) {

    const [progress,setProgress] = useState(0);

    const [file, setFile] = useState();

    useEffect(()=>{
      
    }, [])

    function criarConta(e){
        e.preventDefault();
        let email = document.getElementById('email-cadastro').value;
        
        let senha = document.getElementById('senha-cadastro').value;
        let username = document.getElementById('username-cadastro').value;

        auth.createUserWithEmailAndPassword(email,senha).then((authUser)=>{
            authUser.user.updateProfile({
                displayName:username
            })
            alert('conta criada com sucesso');
            let modal = document.querySelector('.modalCriarConta');

            modal.style.display = "none";
        }).catch((error)=>{
            alert(error.message);
        });
    }

    function logar(e) {
        e.preventDefault();
        let email = document.getElementById('email-login').value;        
        let senha = document.getElementById('senha-login').value;

        auth.signInWithEmailAndPassword(email,senha).then((auth)=>{
            props.setUser(auth.user.displayName);
            alert('Logado com sucesso');
            window.location.href = "/";
        }).catch((err)=>{
            alert(err.message);
        })
    }

    function abrirModalCriarConta(e) {
        e.preventDefault();

        let modal = document.querySelector('.modalCriarConta');

        modal.style.display = "block";
    }
    
    function fecharModal() {
        let modal = document.querySelector('.modalCriarConta');

        modal.style.display = "none";
    }

    function abrirModalUpload(e) {
        e.preventDefault();

        let modal = document.querySelector('.modalUpload');

        modal.style.display = "block";
    }

    function fecharModalUpload() {
        let modal = document.querySelector('.modalUpload');

        modal.style.display = "none";
    }

    function deslogar(e) {
        e.preventDefault();
        auth.signOut().then((val)=>{props.setUser(null)})
        window.location.href = "/";
    }

    function UploadPost(e) {
        e.preventDefault();

        let titulo = document.getElementById('titulo-upload').value;
        let progressEl = document.getElementById('progress-upload');

        const uploadTask = storage.ref(`images/${file.name}`).put(file);

        uploadTask.on("state_changed",function(snapshot){
            const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 100;
            setProgress(progress);
        }, function(error){
            alert(error.message);
        }, function(){

            storage.ref("images").child(file.name).getDownloadURL()
            .then(function (url) {
                db.collection('posts').add({
                    titulo: titulo,
                    image: url,
                    userName: props.user,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })

                setProgress(0);
                setFile(null);

                alert('Upload Realizado com Sucesso');

                document.getElementById('form-upload').reset();
                fecharModalUpload();
            })
        })
    }

    return (
        <div className="header">

            <div className="modalCriarConta">
                <div className="formCriarConta">
                    <div onClick={()=>fecharModal()} className="close-modal-criar">X</div>
                    <h2>Criar Conta</h2>
                    <form onSubmit={(e)=>criarConta(e)} >
                        <input id="email-cadastro" type="text" placeholder="Seu Email..." />
                        <input id="username-cadastro" type="text" placeholder="Seu userName..." />
                        <input id="senha-cadastro" type="password" placeholder="Sua Senha..." />
                        <input type="submit" value="Criar conta!" />
                    </form>
                </div>
            </div>

            <div className="modalUpload">
                <div className="formUpload">
                    <div onClick={()=>fecharModalUpload()} className="close-modal-criar">X</div>
                    <h2>Fazer Post!</h2>
                    <form id="form-upload" onSubmit={(e)=>UploadPost(e)} >
                        <progress id="progress-upload" value={progress}></progress>
                        <input id="titulo-upload" type="text" placeholder="Nome da sua foto..." />
                        <input onChange={(e)=>setFile(e.target.files[0])} type="file" name="file" />
                        <input type="submit" value="Postar!" />
                    </form>
                </div>
            </div>

                <div className="center">
                <div className="header_logo">
                    <a href=""><img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/></a>
                </div>

                {
                    (props.user)?
                    <div className="header_logadoInfo">
                    <span>Olá, <b>{props.user}</b></span>
                    <a onClick={(e)=>abrirModalUpload(e)} href="">Birr!</a>
                    <a onClick={(e)=>deslogar(e)}>Deslogar</a>
                    </div>
                    :
                    <div className="header_loginForm">
                    <form onSubmit={(e)=>logar(e)}>
                        <input id="email-login" type="text" placeholder="Login..."/>
                        <input id="senha-login" type="password"  placeholder="Senha..."/>
                        <input type="submit" name="acao" value="Logar!" />
                    </form>
                    <div className="btn_criarConta">
                    <a onClick={(e)=>abrirModalCriarConta(e)} href="#">Criar Conta</a>
                    </div>
                    </div>

                }

                
                </div>
        </div>
    );
}

export default Header;