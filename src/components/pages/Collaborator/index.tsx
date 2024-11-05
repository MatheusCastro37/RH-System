import Typography from "../../Typography";
import Button from "../../Button";
import styled from "styled-components";
import { theme } from "../../colors/colorts";
import AddSvg from '../../assets/addButton.svg'
import { useEffect, useState } from "react";
import Modal from "../../Modal";
import Input from "../../Input";
import { json } from "react-router-dom";

interface PositionType {
  id: number;
  nomeDoCargo: string;
  nivel: string;
  salario: number;
}

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

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 15px 100px;
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 20px;
`

const AddBox = styled.div`
  width: 350px;
  background-color: ${theme.grayscale.bgLightGrey};
  display: flex;
  flex-direction: column; 
  padding: 20px;
  gap: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  `

const Table = styled.div`
  padding: 20px;
  background-color:${theme.grayscale.bgLightGrey};
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  width: 100%;
  
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
    }

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;

  border-radius: 8px;
}

th {
  background-color: ;
  font-weight: bold;
}


tr{
height: 20px;
}

button {
margin:  auto 0;
}

`

const InputContainer = styled.div`
padding: 10px;
min-width: 100%;
height: 500px;
text-align: start;
display: flex;
flex-direction: column;
align-items: start;
gap: 25px;
overflow-y: scroll;

  input{
  width: 1000%;
  }
  div {  
  width: 100%;
  }


&::-webkit-scrollbar {
  width: 10px;
}


&::-webkit-scrollbar-track {
  background: ${theme.grayscale.bgLightGrey};
  border-radius: 10px; 
}


&::-webkit-scrollbar-thumb {
  background-color: ${theme.corporate.purple}; 
  border-radius: 10px;
  border: 2px solid #f1f1f1; 
}

`

const DivButtons = styled.div`
display: flex;
gap: 20px;
justify-content: center;
`

const Select = styled.select`
appearance: none; /* Remove a aparência padrão */
  padding: 10px;
  font-size: 16px;
  border: 1px solid ${theme.grayscale.spacerLight};
  background-color: ${theme.grayscale.white};
  color: #333;
  cursor: pointer;
  width: 100%;

 &:focus {
  outline: none;
  border-color: ${theme.corporate.purple};
}

}
`

export default function Collaborator() {

  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cargo, setCargo] = useState(0);
  const [nivel, setNivel] = useState("");
  const [salario, setSalario] = useState(0);
  const [postionInputsDisable, setPositionInputsDisable] = useState(false);
  const [cepInputsDisable, setCepInputsDisable] = useState(false)
  const [numero, setNumero] = useState("");
  const [cargos, setCargos] = useState<PositionType[]>();
  const [collaboratorList, setCollaboratorsList] = useState<Collaborator[]>();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const apikey = import.meta.env.VITE_SUPABASE_ANON_KEY;


  useEffect(() => {
    if (isValidCep(cep)) {
      getLocationByCep(cep)
      setCepInputsDisable(true)
    } else {
      setCepInputsDisable(false)
      setLogradouro("")
      setCidade("")
      setEstado("")
    }
  }, [cep])


  function isValidCep(cep: string): boolean {
    const cepPattern = /^[0-9]{5}-?[0-9]{3}$/;
    return cepPattern.test(cep);
  }



  useEffect(() => { getPositions() }, [])
  useEffect(() => { getCollaborators() }, [])

  useEffect(() => {

    if (cargo == 0) {
      setNivel("")
      setSalario(0)
      setPositionInputsDisable(false)
      return;
    }
    if (cargos) {
      const CargoSelecionado = cargos.filter(elemente => elemente.id == cargo)
      setNivel(CargoSelecionado[0].nivel)
      setSalario(CargoSelecionado[0].salario)
      setPositionInputsDisable(true)
    }

  }, [cargo])

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

  async function getCollaborators(): Promise<Collaborator[] | null> {
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
      setCollaboratorsList(data);
      console.log(data)
      return data;
    } catch (error) {
      console.error("Erro ao buscar Cargos na API: " + error)
      return null;
    }
  }

  function showPositionOptions(positions: PositionType[]) {
    return positions.map(position => (
      <option key={position.id} value={position.id}>{position.nomeDoCargo}</option>
    ))
  }

  function showCollaboratorsRows(collaborators: Collaborator[]) {

    return collaborators.map(collaborator => {
      let colabCareer = cargos;

      if(cargos) {
        colabCareer = cargos.filter(cargo => cargo.id == collaborator.idCargo);
      }
      
      return (

      <tr key={collaborator.id}>
        <td><Typography variant="body-XS">{collaborator.nome}</Typography></td>
        <td><Typography variant="body-XS">{collaborator.cpf}</Typography></td>
        <td><Typography variant="body-XS">{collaborator.cep}</Typography></td>
        <td><Typography variant="body-XS">{collaborator.logradouro}</Typography></td>
        <td><Typography variant="body-XS">{collaborator.numero}</Typography></td>
        <td><Typography variant="body-XS">{collaborator.cidade}</Typography></td>
        <td><Typography variant="body-XS">{collaborator.estado}</Typography></td>
        <td><Typography variant="body-XS">{colabCareer && colabCareer[0].nomeDoCargo}</Typography></td>
        <td><Typography variant="body-XS">{colabCareer && colabCareer[0].nivel}</Typography></td>
        <td><Typography variant="body-XS">{colabCareer && colabCareer[0].salario}</Typography></td>
        <td><Button size="small" variant="text" ><Typography variant="body-XS">Editar</Typography></Button></td>
      </tr>
      )
    })
  }

  async function getLocationByCep(cep: string) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()

      if (data) {
        setLogradouro(data.logradouro)
        setCidade(data.localidade)
        setEstado(data.estado)
      }
    } catch (error) {
      console.error('Erro ao buscar CEP: ' + error)
    }
  }

  function openModal() {
    setModalIsVisible(true)
  }

  function closeModal() {
    setModalIsVisible(false)
    setName("")
    setCpf("")
    setCep("")
    setLogradouro("")
    setCidade("")
    setNumero("")
    setEstado("")
    setCargo(0)
    setNivel("")
    setSalario(0)
  }

  const newCollaborator: Collaborator = {
    nome: name,
    cpf,
    cep,
    logradouro,
    numero,
    cidade,
    estado,
    idCargo: cargo
  }

  async function RegisterNewCollaborator(collaborator: Collaborator): Promise<void> {
    try {
      const res = fetch(`${supabaseUrl}/rest/v1/Colaborador`, {
        method: 'POST',
        headers: {
          apikey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newCollaborator })
      });

      const data = (await res).json();

      console.log(data)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container>
      <Modal onClose={closeModal} isVisible={modalIsVisible}>
        <InputContainer>
          <Typography variant="H3">Adicionar Colaborador</Typography>
          <Input height="small" value={name} onChange={e => setName(e.target.value)} textLabel={<Typography variant="body-XS">Nome</Typography>}></Input>
          <Input height="small" value={cpf} onChange={e => setCpf(e.target.value)} textLabel={<Typography variant="body-XS">CPF</Typography>}></Input>
          <Input height="small" value={cep} onChange={e => setCep(e.target.value)} textLabel={<Typography variant="body-XS">CEP</Typography>}></Input>
          <Input height="small" value={numero} onChange={e => setNumero(e.target.value)} textLabel={<Typography variant="body-XS">Número</Typography>}></Input>
          <Input height="small" value={logradouro} disabled={cepInputsDisable} onChange={e => setLogradouro(e.target.value)} textLabel={<Typography variant="body-XS">Logradouro</Typography>}></Input>
          <Input height="small" value={cidade} disabled={cepInputsDisable} onChange={e => setCidade(e.target.value)} textLabel={<Typography variant="body-XS">Cidade</Typography>}></Input>
          <Input height="small" value={estado} disabled={cepInputsDisable} onChange={e => setEstado(e.target.value)} textLabel={<Typography variant="body-XS">Estado</Typography>}></Input>
          <Select onChange={e => setCargo(Number(e.target.value))}>
            <option value="0"><Typography variant="body-XS">Selecione Um Cargo</Typography></option>
            {cargos && showPositionOptions(cargos)}
          </Select>
          <Input height="small" value={nivel} disabled={postionInputsDisable} onChange={e => setNivel(e.target.value)} textLabel={<Typography variant="body-XS">Nivel</Typography>}></Input>
          <Input height="small" value={salario} disabled={postionInputsDisable} onChange={e => setSalario(Number(e.target.value))} textLabel={<Typography variant="body-XS">Salário</Typography>}></Input>
          <DivButtons>
            <Button size="large" variant="secondary" onClick={closeModal}><Typography variant="body-XS" >Cancelar</Typography></Button>
            <Button size="large" variant="main"><Typography variant="body-XS" >Adicionar</Typography></Button>
          </DivButtons>
        </InputContainer>
      </Modal>
      <AddBox>
        <Typography variant="body-L">Adicionar Colaborador</Typography>
        <Button size="large" variant="main" icon={AddSvg} onClick={openModal} >
          <Typography variant="body-M-regular">Adicionar</Typography>
        </Button>
      </AddBox>

      <Table>
        <Typography variant="H2">Colaboradores</Typography>
        <table>
          <thead>
            <tr>
              <th><Typography variant="body-S">Nome</Typography></th>
              <th><Typography variant="body-S">CPF</Typography></th>
              <th><Typography variant="body-S">CEP</Typography></th>
              <th><Typography variant="body-S">Logradouro</Typography></th>
              <th><Typography variant="body-S">Número</Typography></th>
              <th><Typography variant="body-S">Cidade</Typography></th>
              <th><Typography variant="body-S">Estado</Typography></th>
              <th><Typography variant="body-S">Cargo</Typography></th>
              <th><Typography variant="body-S">Nível</Typography></th>
              <th><Typography variant="body-S">Salário</Typography></th>
            </tr>
          </thead>
          <tbody>
            
            {collaboratorList && showCollaboratorsRows(collaboratorList)}
          </tbody>
        </table>
      </Table>
    </Container>
  );
}
