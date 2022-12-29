import { useLocation } from "react-router-dom";
import { Message } from "../layout/Message";
import styles from './Projects.module.css'
import { Container } from "../layout/Container";
import { LinkButton } from "../layout/LinkButton";
import { ProjectCard } from "../project/ProjectCard";
import { useEffect, useState } from "react";
import { Loading } from "../layout/Loading";



export function Projects() {

    const [removeLoader, setRemoveLoader] = useState(false)
    const [projects, setProjects] = useState([])
    const [projectMessage, setProjectMessage] = useState(false)
    let message = ''
    const location = useLocation()
    //console.log(location)

    useEffect(() => {
        fetch("http://localhost:5000/projects", {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
            },

        })
            .then((res) => res.json())
            .then((data) => {
                setProjects(data)
                setRemoveLoader(true)
            }).catch((err) => console.log(err))
    }, [])

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(() => {
                setProjects(projects.filter((project) => project.id !== id))
                setProjectMessage("Projeto removido com sucesso!")

            })
            .catch(err => console.log(err))
    }


    if (location.state) {
        message = location.state.message
    }
    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1> Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
            {message && <Message msg={message} type="success" />}
            {projectMessage && <Message msg={projectMessage} type="success" />}
            <Container customClass="start">
                {projects.length > 0 &&
                    projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            budget={project.budget}
                            category={project.category?.["name"]}
                            handleRemove={removeProject}
                        />
                    ))
                }
                {!removeLoader && <Loading />}
                {removeLoader && projects.length === 0}

            </Container>

        </div>
    )
}