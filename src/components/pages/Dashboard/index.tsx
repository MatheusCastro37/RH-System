import { Bar, BarChart, CartesianGrid, Legend, Rectangle, Tooltip, XAxis, YAxis } from "recharts";
import Typography from "../../Typography";
import { BodyContainer, CardContainer } from "./styles";
import { useEffect, useState } from "react";
import { theme } from "../../colors/colorts";
interface Collaborator {
    id?: number;
    nome: string;
    cpf: string;
    cep: string;
    logradouro: string;
    numero: string;
    cidade: string;
    estado: string;
    idCargo: number;
}
interface PositionType {
    id: number;
    nomeDoCargo: string;
    nivel: string;
    salario: number;
}

interface ChartData {
    cargo: string;
    Quantidade: number;
    salario: number;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const apikey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function Dashboard() {
    const [collaboratorList, setCollaboratorList] = useState<Collaborator[]>()
    const [cargos, setCargos] = useState<PositionType[]>();

    useEffect(() => { getCollaborators() }, [])
    useEffect(() => { getPositions() }, [])

    async function getCollaborators() {
        try {
            const res = await fetch(`${supabaseUrl}/rest/v1/Colaborador`, {
                headers: {
                    method: 'GET',
                    apikey
                }
            })

            if (!res) {
                throw new Error
            }

            const data: Collaborator[] = await res.json();
            setCollaboratorList(data)
            console.log(data)
        } catch (error) {
            console.error("Erro ao buscar Cargos na API: " + error)

        }
    }

    async function getPositions(): Promise<PositionType[] | null> {
        try {

            const res = await fetch(`${supabaseUrl}/rest/v1/Cargo`, {
                headers: {
                    method: 'GET',
                    apikey
                }
            })

            if (!res) {
                throw new Error
            }

            const data: PositionType[] = await res.json();
            setCargos(data)

            return data
        } catch (error) {
            console.error("Erro ao buscar Cargos na API: " + error)
            return null;
        }
    }

    function setDataForChart() {
        const data: ChartData[] = [

        ]



        if (collaboratorList && cargos) {


            collaboratorList.map(collaborator => {
                let carrerExist = false

                const collabCarrer = cargos.find(cargo => cargo.id == collaborator.idCargo)

                for (const i of data) {
                    if (i.cargo == collabCarrer?.nomeDoCargo) {
                        carrerExist = true;
                        i.Quantidade++;
                    }
                }

                if (!carrerExist && collabCarrer) {
                    data.push({
                        cargo: collabCarrer.nomeDoCargo,
                        Quantidade: 1,
                        salario: collabCarrer.salario
                    })
                }
            })


        }
        console.log(data);
        return data;
    }


    interface CustomTooltipProps {
        active?: boolean;
        payload?: {
            payload: {
                cargo: string;
                Quantidade: number;
                salario: number;
            };
        }[];
        label?: string;
    }

    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            const { cargo, Quantidade, salario } = payload[0].payload;
            return (
                <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
                    <p><strong>{cargo}</strong></p>
                    <p>Quantidade: {Quantidade}</p>
                    <p>Salário: R$ {salario.toFixed(2)}</p>
                </div>
            );
        }

        return null;
    };


    return (
        <BodyContainer>
            <CardContainer>
                <Typography variant="H4">Olá, bem vindo fulano de tal</Typography>
            </CardContainer>
            <CardContainer>
                <Typography variant="H4">Distribuição de Colaboradores por Cargo</Typography>
                <BarChart width={1000} height={350} data={setDataForChart()} margin={{ top: 5, right: 20, left: 20, bottom: 5, }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cargo" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Quantidade" fill={theme.corporate.purple} activeBar={<Rectangle fill="pink" stroke="blue" />} />
                </BarChart>
            </CardContainer>
            <CardContainer>
                <Typography variant="H4">Grafico 2</Typography>
            </CardContainer>
        </BodyContainer>
    );
}