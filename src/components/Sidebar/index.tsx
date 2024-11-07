import styled from "styled-components"
import MenuPng from '../assets/menu.png'
import { theme } from "../colors/colorts"
import { useState } from "react"
import CloseImg from '../assets/close.svg'
import dashIcon from '../assets/dashIcon.png'
import colabIcon from '../assets/collab.png'
import careerIcon from '../assets/gravata.png'
import Typography from "../Typography"
import Button from "../Button"
import { useNavigate } from "react-router-dom"


const MenuImg = styled.img`
width: 50px;
height: 50px;
position: absolute;
translate: transform(-50%,-50%);
top: 1%;
left: 1%;
cursor: pointer;
`

const CloseBtn = styled.img`
width: 20px;
height: 20px;
cursor: pointer;
`

const SidebarContainer = styled.aside<{ $isVisible: boolean }>`
width: 300px;
height: 100vh;
background-color: ${theme.grayscale.bgLightGrey};
position: absolute;
z-index: 9997;
left: ${props => props.$isVisible ? '0%' : '-100%'};
padding: 15px;
display: flex;
flex-direction: column;
align-items: end;
transition: all 0.4s;
gap: 20px;
`

const SidebarContent = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
align-items: start;
justify-content: start;
gap: 25px;

    button {
    margin-left: 20px;
    }
`

const Overlay = styled.div<{ $isVisible: boolean }>`
position: absolute;
display: ${p => p.$isVisible ? 'block' : 'none'};
transition: all 0.4s;
z-index: 9996;
width: 100vw;
height: 100vh;
background-color: rgba(26, 20, 31, 0.7);
opacity: ${p => p.$isVisible ? '70%' : '0%'};
`

export default function Sidebar() {
    const [isVisible, setIsVisible] = useState(false)
    const navigate = useNavigate();

    function openSidebar() {
        setIsVisible(true)
    }

    function closeSideBar() {
        setIsVisible(false)
    }

    function gotoCollabPage () {
        navigate('/collaborator')
    }

    function gotoCareerPage () {
        navigate('/carrer')
    }


    return (
        <>
            <MenuImg src={MenuPng} onClick={openSidebar} />
            <SidebarContainer $isVisible={isVisible}>
                <CloseBtn src={CloseImg} onClick={closeSideBar} />
                <SidebarContent>
                    <Typography variant="H2">RH System</Typography>

                    <Button variant="text" size="large" icon={dashIcon} ><Typography variant="body-M-regular">Dashboard</Typography></Button>
                    <Button variant="text" size="large" icon={colabIcon} onClick={gotoCollabPage}><Typography variant="body-M-regular">Colaboradores</Typography></Button>
                    <Button variant="text" size="large" icon={careerIcon} onClick={gotoCareerPage}><Typography variant="body-M-regular">Cargos</Typography></Button>
                </SidebarContent>
            </SidebarContainer>
            <Overlay $isVisible={isVisible} onClick={closeSideBar}></Overlay>
        </>
    )
}