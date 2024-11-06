import styled from "styled-components";
import { theme } from "../../colors/colorts";

export const BodyWrapper = styled.div`
    width: 100vw;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;
    padding: 20px;

    label{
        text-align: start;
    }

    .btn-modal div:first-child{
        display: none;
    }

    .btn-modal div.show-loading{
        display: block;
    }

    .notification{
        position: absolute;
        transition: .3s ease-in-out;

        img{
            height: 70px;
        }
    }

    .notification.hidden{
        bottom: 150%;
    }

    .notification.show{
        bottom: 70%;
    }
`;

export const ListingContainer = styled.div`
    width: 100%;
    max-width: 780px;
    background-color: ${theme.grayscale.black};
    border-radius: 10px;
    border: 1px solid ${theme.grayscale.white};
    padding: 10px 15px;
    color: ${theme.grayscale.white};

    div:nth-child(1){
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    h4{
        margin: 10px 0 15px 0;
    }

    table{
        border-collapse: collapse;
        width: 100%;
    }

    th,
    td{
        text-align: start;
        border-bottom: 1px solid ${theme.grayscale.white};
        padding: 10px 5px;
    }
`;