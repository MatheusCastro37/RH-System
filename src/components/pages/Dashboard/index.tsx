import { useCallback, useEffect, useState } from "react";
import Typography from "../../Typography";
import { BodyContainer, CardContainer, Select } from "./styles";
import { PieChart, Pie, Sector } from 'recharts';
import { carrers, collaborator, payload, propsGraph, selectType } from "./types";
import { theme } from "../../colors/colorts";

let textTooltip: string;

const renderActiveShape = ({payload, ...props}: propsGraph) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${textTooltip}: ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Porcentagem ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function Dashboard() {
  const [activeIndex, setActiveIndex] = useState(0);

  const [valueSelect, setValueSelect] = useState<selectType>("region");

  const [listDataGraph, setListDataGraph] = useState<payload<string | number>[]>([]);

  const onPieEnter = useCallback(
    (_, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const apikey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    if(valueSelect === "region") {
      getCollabs();
      textTooltip = "Funcionarios";
    } else {
      getSalaries();
      textTooltip = "Salario";
    }
  }, [valueSelect]);

  async function getCollabs() {
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

      const data: collaborator[] = await res.json();
      const dataMapping = mappingCollabs(data);
      console.log(dataMapping)
      setListDataGraph(dataMapping);
      return data;
    } catch (error) {
      console.error("Erro ao buscar Cargos na API: " + error)
      return null;
    }
  };

  async function getSalaries() {
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

      const data: carrers[] = await res.json();
      const dataMapping = mappingSalaries(data);
      console.log(dataMapping)
      setListDataGraph(dataMapping);
      return data;
    } catch (error) {
      console.error("Erro ao buscar Cargos na API: " + error)
      return null;
    }
  }

  function mappingCollabs(data: collaborator[]) {
    const contagem: { [key: string]: number } = {};

    // Contar as ocorrências de cada estado
    data.forEach(item => {
      if (contagem[item.estado]) {
        contagem[item.estado] += 1; // Incrementa se o estado já apareceu
      } else {
        contagem[item.estado] = 1; // Adiciona a primeira ocorrência
      }
    });

    // Cria a nova lista com os estados e suas quantidades
    const result = Object.keys(contagem).map(name => ({
      name,
      value: contagem[name]
    }));

    return result;
  }

  function mappingSalaries(data: carrers[]) {
    const resultado: { [key: string]: { somaSalarios: number, quantidade: number } } = {};

    // Agrupar cargos e somar os salários
    data.forEach(cargo => {
      if (!resultado[cargo.nomeDoCargo]) {
        resultado[cargo.nomeDoCargo] = { somaSalarios: 0, quantidade: 0 };
      }
      resultado[cargo.nomeDoCargo].somaSalarios += cargo.salario;
      resultado[cargo.nomeDoCargo].quantidade += 1;
    });

    // Criar o array de resultados com nome do cargo e média dos salários
    const mediasSalarios = Object.keys(resultado).map(cargo => {
      const { somaSalarios, quantidade } = resultado[cargo];
      return {
        name: cargo,
        value: somaSalarios / quantidade
      };
    });

    return mediasSalarios;
  }

  return(
      <BodyContainer>
          <CardContainer>
              <Typography variant="H4">Olá, bem vindo fulano de tal</Typography>
          </CardContainer>
          <CardContainer>
              <Typography variant="H4">Grafico 1</Typography>
          </CardContainer>
          <CardContainer>
            <div className="graph-container">
              <div>
                <label htmlFor="select-type-pie">
                  <Typography variant="body-XS">Selecione a comparação:</Typography>
                  <Select id="select-type-pie" value={valueSelect} onChange={(e) => setValueSelect(e.target.value)}>
                    <option value="region">Estado</option>
                    <option value="salary">Salario</option>
                  </Select>
                </label>
              </div>
              <PieChart width={700} height={250}>
              <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={listDataGraph}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill={theme.corporate.purple}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
              />
              </PieChart>
              <Typography variant="H4">Comparativo de funcionarios por estado</Typography>
            </div>
          </CardContainer>
      </BodyContainer>
  );
}