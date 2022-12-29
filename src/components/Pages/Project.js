import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Loading } from '../layout/Loading'
import { Container } from '../layout/Container'
import { ProjectForm } from '../project/ProjectForm'
import { Message } from '../layout/Message'
import { ServiceForm } from '../service/ServiceForm'
import { ServiceCard } from '../service/ServiceCard'

export function Project() {
    const { id } = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(true)
    const [showServiceForm, setShowServiceForm] = useState(true)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setProject(data)
                setServices(data.services)
            })
            .catch((error) => console.log(error))
    }, [id])

    function editPost(project) {
        setMessage('')
        if (project.budget < project.cost) {
            setMessage("O orçamento não pode ser menor que o custo do projeto")
            setType("error")
            return false
        }
        fetch(`http://localhost:5000/projects/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
            .then((res) => res.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(false)
                setMessage("Projeto Atualizado")
                setType("success")
            })
            .catch((error) => console.log(error))

    }

    function createService(project) {
        setMessage('')
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop() //Remove o serviço do objeto
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
            .then(res => res.json())
            .then((data) => {
                setShowServiceForm(false)

            })
            .catch(err => console.log(err))

    }

    function removeService(id, cost) {
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
            .then((res) => res.json())
            .then(() => {
                setProject(projectUpdated)
                setServices(servicesUpdated)
                setMessage("Serviço removido com sucesso")
                setType("success")
            })
            .catch((error) => console.log(error))
    

    }

    return (
        <>
            {project.name ?
                (
                    <div className={styles.project_details}>
                        <Container customClass="column">
                            {message && <Message type={type} msg={message} />}
                            <div className={styles.details_container}>
                                <h1>Projeto:  {project.name}</h1>

                                <button className={styles.btn} onClick={() => setShowProjectForm(!showProjectForm)}>
                                    {!showProjectForm ? 'Editar projeto' : 'Fechar projeto'}
                                </button>
                                {!showProjectForm ? (
                                    <div className={styles.project_info}>
                                        <p>
                                            <span>Categoria:</span>{project.category?.['name']}
                                        </p>

                                        <p>
                                            <span>Total de orçamento:</span>R$ {project.budget}
                                        </p>

                                        <p>
                                            <span>Total Utilizado:</span>R$ {project.cost}
                                        </p>

                                    </div>
                                ) :
                                    (
                                        <div className={styles.project_info}>
                                            <ProjectForm
                                                handleSubmit={editPost}
                                                btnText="Concluir edição"
                                                projectData={project}
                                            />
                                        </div>
                                    )

                                }
                            </div>
                            <div className={styles.service_form_container}>
                                <h2>
                                    Adicione um serviço:
                                </h2>
                                <button className={styles.btn} onClick={() => setShowServiceForm(!showServiceForm)}>
                                    {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                                </button>
                                <div className={styles.project_info}>
                                    {showServiceForm && (
                                        <ServiceForm
                                            handleSubmit={createService}
                                            textBtn="Adicionar Serviço"
                                            projectData={project}
                                        />

                                    )
                                    }

                                </div>

                            </div>
                            <h2>Serviços</h2>
                            <Container customClass="start">
                                {services.length > 0 &&
                                    services.map((service) => (
                                        <ServiceCard
                                            id={service.id}
                                            name={service.name}
                                            cost={service.cost}
                                            description={service.description}
                                            key={service.id}
                                            handleRemove={removeService}
                                        />
                                    ))
                                }

                                {services.length === 0 &&
                                    <p>Não há serviços cadastrados</p>
                                }
                            </Container>
                        </Container>
                    </div>
                )
                :
                <Loading />

            }</>
    )
}