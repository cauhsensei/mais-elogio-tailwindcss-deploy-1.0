// app/api/companydata/route.js

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cnpj = searchParams.get('cnpj');

  if (!cnpj) {
    return new Response(JSON.stringify({ error: 'CNPJ is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const res = await fetch(`https://www.receitaws.com.br/v1/cnpj/${encodeURIComponent(cnpj)}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    // Estruture os dados que serão enviados de volta para o frontend
    const responseData = {
      email: data.email,
      nome: data.nome, // Nome oficial da empresa
      fantasia: data.fantasia, // Nome fantasia da empresa
      telefone: data.telefone, // Telefone da empresa
      atividadePrincipal: data.atividade_principal[0]?.text, // Atividade principal
      situacao: data.situacao // Situação da empresa
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
