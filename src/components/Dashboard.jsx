import React, { useState, useEffect } from 'react';

const Dashboard = ({ leads, usuarioLogado }) => {


  const [leadsClosed, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filtroAplicado, setFiltroAplicado] = useState({ inicio: '', fim: '' });
  
    // Função para buscar os leads
    const buscarLeads = async () => {
      try {

        const respostaLeads = await fetch(
            'https://script.google.com/macros/s/AKfycby8vujvd5ybEpkaZ0kwZecAWOdaL0XJR84oKJBAIR9dVYeTCv7iSdTdHQWBb7YCp349/exec?v=pegar_clientes_fechados'
          );

        const dadosLeads = await respostaLeads.json();

        setLeads(dadosLeads);
      
      } catch (error) {
        console.error('Erro ao buscar leads:', error);
      } finally {
        setLoading(false);
      }
    };
  
    // Chama a função ao carregar o componente
    useEffect(() => {
      buscarLeads();
    }, []);

    const aplicarFiltroData = () => {
      console.log('Filtrando de', dataInicio, 'até', dataFim);
      // ou se quiser atualizar um state de "filtro aplicado"
      setFiltroAplicado({ inicio: dataInicio, fim: dataFim });
    };

    let leadsFiltrados = leads.filter((lead) => {
      console.log("filtrando...");

      // Se nenhum filtro aplicado, retorna todos
      if (!filtroAplicado.inicio && !filtroAplicado.fim) return true;

      // Converte createdAt para string no formato YYYY-MM-DD (UTC)
      const dataLeadStr = new Date(lead.createdAt).toISOString().slice(0, 10);

      // Pega os valores do filtro já no formato YYYY-MM-DD
      const dataInicioStr = filtroAplicado.inicio;
      const dataFimStr = filtroAplicado.fim;

      // Faz a comparação como string (segura porque formato é ISO)
      if (dataInicioStr && dataLeadStr < dataInicioStr) return false;
      if (dataFimStr && dataLeadStr > dataFimStr) return false;

      return true;
    });

  // Contadores existentes
  const totalLeads = leadsFiltrados.length;
  const leadsFechados = leadsFiltrados.filter(lead => lead.status === 'Fechado').length;
  const leadsPerdidos = leadsFiltrados.filter(lead => lead.status === 'Perdido').length;
  const leadsEmContato = leadsFiltrados.filter(lead => lead.status === 'Em Contato').length;
  const leadsSemContato = leadsFiltrados.filter(lead => lead.status === 'Sem Contato').length;

  // Filtrar leads por data
  const filtrarPorData = (lista) => {
    if (!dataInicio && !dataFim) return lista;

    return lista.filter((lead) => {
      const dataLead = new Date(lead.data);
      const inicio = dataInicio ? new Date(dataInicio) : null;
      const fim = dataFim ? new Date(dataFim) : null;

      if (inicio && fim) {
        return dataLead >= inicio && dataLead <= fim;
      } else if (inicio) {
        return dataLead >= inicio;
      } else if (fim) {
        return dataLead <= fim;
      }
      return true;
    });
  };


  //let leadsFiltrados = filtrarPorData(leads);

 
  // Novos contadores (exemplo: filtragem por insuranceType)
 
  // Se o usuário for admin, pega todos os leads fechados
  //let leadsFiltrados = [];

  let leadsFiltradosClosed;

  if (usuarioLogado.tipo === 'Admin') {
    leadsFiltradosClosed  = leadsClosed;
    console.log(leadsClosed)
  } else {
    // Se não for admin, filtra pelos leads que ele é responsável
    leadsFiltradosClosed  = leadsClosed.filter(lead => lead.Responsavel === usuarioLogado.nome);
  }

  // Aplica o filtro de data em leadsClosed
    leadsFiltradosClosed = leadsFiltradosClosed.filter((lead) => {
      console.log("filtrando...");

      // Se nenhum filtro aplicado, retorna todos
      if (!filtroAplicado.inicio && !filtroAplicado.fim) return true;

      // Converte createdAt para string no formato YYYY-MM-DD (UTC)
      const dataLeadStr = new Date(lead.Data).toISOString().slice(0, 10);

      // Pega os valores do filtro já no formato YYYY-MM-DD
      const dataInicioStr = filtroAplicado.inicio;
      const dataFimStr = filtroAplicado.fim;

      // Faz a comparação como string (segura porque formato é ISO)
      if (dataInicioStr && dataLeadStr < dataInicioStr) return false;
      if (dataFimStr && dataLeadStr > dataFimStr) return false;

      return true;
    });

  // Agora faz a contagem de cada seguradora com base nos leads filtrados
  const portoSeguro = leadsFiltradosClosed.filter(lead => lead.Seguradora === 'Porto Seguro').length;
  const azulSeguros = leadsFiltradosClosed.filter(lead => lead.Seguradora === 'Azul Seguros').length;
  const itauSeguros = leadsFiltradosClosed.filter(lead => lead.Seguradora === 'Itau Seguros').length;
  const demais = leadsFiltradosClosed.filter(lead => lead.Seguradora === 'Demais Seguradoras').length;

  //console.log("leadsClosed - jsx2", usuarioLogado)
  /*const demais = leads.filter(
    lead =>
      lead.insurancetype !== 'Porto Seguro' &&
      lead.insurancetype !== 'Azul Seguros' &&
      lead.insurancetype !== 'Itau Seguros'
  ).length;*/

  // Estilo comum para as caixas
  const boxStyle = {
    padding: '10px',
    borderRadius: '5px',
    flex: 1,
    color: '#fff',
    textAlign: 'center'
  };



  

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* Filtro de datas com botão */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
            title="Data de Início"
          />
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
            title="Data de Fim"
          />
          <button
            onClick={aplicarFiltroData}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              cursor: 'pointer',
            }}
          >
            Filtrar
          </button>
        </div>


      {/* Primeira linha de contadores */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ ...boxStyle, backgroundColor: '#eee', color: '#333' }}>
          <h3>Total de Leads</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalLeads}</p>
        </div>
        <div style={{ ...boxStyle, backgroundColor: '#4CAF50' }}>
          <h3>Leads Fechados</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{leadsFechados}</p>
        </div>
        <div style={{ ...boxStyle, backgroundColor: '#F44336' }}>
          <h3>Leads Perdidos</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{leadsPerdidos}</p>
        </div>
        <div style={{ ...boxStyle, backgroundColor: '#FF9800' }}>
          <h3>Em Contato</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{leadsEmContato}</p>
        </div>
        <div style={{ ...boxStyle, backgroundColor: '#9E9E9E' }}>
          <h3>Sem Contato</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{leadsSemContato}</p>
        </div>
      </div>

      {/* Segunda linha de contadores (novos) */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ ...boxStyle, backgroundColor: '#003366' }}>
          <h3>Porto Seguro</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{portoSeguro}</p>
        </div>
        <div style={{ ...boxStyle, backgroundColor: '#87CEFA' }}>
          <h3>Azul Seguros</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{azulSeguros}</p>
        </div>
        <div style={{ ...boxStyle, backgroundColor: '#FF8C00' }}>
          <h3>Itau Seguros</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{itauSeguros}</p>
        </div>
        <div style={{ ...boxStyle, backgroundColor: '#4CAF50' }}>
          <h3>Demais Seguradoras</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{demais}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
