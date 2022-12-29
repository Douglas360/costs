

import { useNavigate } from 'react-router-dom'
import { ProjectForm } from '../project/ProjectForm'
import styles from './NewProject.module.css'
export function NewProject() {

    const navigate = useNavigate()

    function creatPost(project) {

        project.cost = 0
        project.services = []

        fetch("http://localhost:5000/projects", {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(project)
        })
            .then((res) => res.json)
            .then((data) => {
                //navigate('/project', { message: "Projeto criado com sucesso" })
                navigate('/projects', { state: { message: "Projeto criado com sucesso" } })

            }).catch((err) => console.log(err))

    }



    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto par depois adicionar os serviços</p>
            <ProjectForm handleSubmit={creatPost} btnText="Criar Projeto" />
        </div>
    )
}
