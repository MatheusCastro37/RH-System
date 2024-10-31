import styled from "styled-components";
import { theme } from "../../components/colors/colorts";

export const Container = styled.div`
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    >div,
    input{
        width: 90%;
        padding: 20px;
        max-width: 375px;
        
        >div{
            width: 100%;
            margin-top: 15px;
        }
    }
`;

export const WrapperForm = styled.div`
    background-color: ${theme.grayscale.bgLightGrey};
    border-radius: 20px;

    h3{
        text-align: center;
    }
`;

export const ContainerButton = styled.div`
    display: flex;
    justify-content: center;
`;