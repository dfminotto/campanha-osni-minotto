import { CampaignContactForm } from '@/components/CampaignContactForm'

const PROPOSALS = [
  { icon: '🏥', title: 'Saúde mais próxima da população', desc: 'Mais atendimento e qualidade para todos.' },
  { icon: '🛡️', title: 'Segurança nos bairros', desc: 'Mais presença e ações eficazes.' },
  { icon: '🎓', title: 'Educação e oportunidades', desc: 'Investimento no futuro da nossa gente.' },
  { icon: '🚌', title: 'Transporte público de qualidade', desc: 'Mobilidade eficiente e acessível.' },
  { icon: '🏪', title: 'Apoio ao comércio local', desc: 'Incentivo a quem gera emprego e renda.' },
  { icon: '🧹', title: 'Zeladoria urbana', desc: 'Cidade limpa, cuidada e organizada.' },
]

const AGENDA = [
  { day: '25', month: 'MAI', title: 'Caminhada no bairro Centro', desc: 'Domingo • 09h', local: 'Ponto de encontro: Praça Central' },
  { day: '27', month: 'MAI', title: 'Reunião com moradores', desc: 'Terça-feira • 19h', local: 'Associação de Moradores' },
  { day: '30', month: 'MAI', title: 'Encontro com comerciantes', desc: 'Sexta-feira • 18h', local: 'Salão do Comércio Local' },
  { day: '02', month: 'JUN', title: 'Live nas redes sociais', desc: 'Segunda-feira • 20h', local: 'Ao vivo no Instagram e Facebook' },
]

const SOCIALS = [
  { name: 'Instagram', handle: '@nomedocandidato', href: '#', color: '#E1306C', letter: 'I' },
  { name: 'Facebook', handle: '/nomedocandidato', href: '#', color: '#1877F2', letter: 'f' },
  { name: 'TikTok', handle: '@nomedocandidato', href: '#', color: '#010101', letter: 'T' },
  { name: 'WhatsApp', handle: 'Fale com a equipe', href: '#', color: '#25D366', letter: 'W' },
]

export default function Home() {
  const name = process.env.NEXT_PUBLIC_CANDIDATE_NAME || 'Nome do Candidato'

  return (
    <>
      {/* ── NAVEGAÇÃO ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-black text-[#0d2461] text-lg leading-none">UNIÃO<br/>BRASIL</span>
            <span className="font-black text-[#f5a623] text-3xl leading-none ml-1">44</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            {['Início', 'Propostas', 'Agenda', 'Participe', 'Contato'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-[#0d2461] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            href="#participe"
            className="bg-[#f5a623] hover:bg-yellow-500 text-black font-bold px-5 py-2 rounded-full text-sm transition-colors"
          >
            Quero apoiar
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="início" className="relative bg-[#0d2461] overflow-hidden pt-16">
        {/* Faixa amarela diagonal */}
        <div
          className="absolute right-0 top-0 h-full w-[48%] bg-[#f5a623]"
          style={{ clipPath: 'polygon(22% 0, 100% 0, 100% 100%, 0% 100%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex items-end min-h-[560px]">
          {/* Texto */}
          <div className="w-full md:w-1/2 text-white z-10 pb-16 pt-12">
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Juntos por uma{' '}
              <span className="text-[#f5a623]">cidade melhor</span>{' '}
              para todos!
            </h1>
            <p className="mt-4 text-blue-200 text-lg max-w-md">
              Trabalho, honestidade e compromisso com o que realmente importa: as pessoas.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#propostas"
                className="bg-[#f5a623] hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors"
              >
                Conhecer propostas →
              </a>
              <a
                href="#participe"
                className="border-2 border-white text-white hover:bg-white hover:text-[#0d2461] font-bold px-6 py-3 rounded-full text-sm transition-colors"
              >
                Fazer parte da campanha
              </a>
            </div>
            <div className="mt-10 flex items-center gap-2">
              <span className="font-black text-white text-xl">UNIÃO</span>
              <span className="font-black text-[#f5a623] text-2xl">BRASIL</span>
              <span className="font-black text-[#f5a623] text-3xl">44</span>
            </div>
          </div>

          {/* Foto do candidato — adicione /public/candidato.jpg para mostrar */}
          <div className="hidden md:block absolute right-[18%] bottom-0 w-64 xl:w-80 z-10">
            <div className="w-full h-96 xl:h-[420px] bg-[#f5a623]/20 rounded-t-full border-2 border-[#f5a623]/30 flex items-center justify-center">
              <p className="text-white/40 text-xs text-center px-4">
                Adicione<br />candidato.jpg<br />em /public
              </p>
            </div>
          </div>

          {/* Card do candidato */}
          <div className="hidden md:block absolute right-4 bottom-8 bg-white rounded-2xl p-5 shadow-xl z-20 min-w-[210px]">
            <span className="text-xs font-bold text-[#0d2461] uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
              Candidato a Vereador
            </span>
            <h2 className="text-lg font-black text-[#0d2461] mt-2 leading-tight">{name}</h2>
            <p className="text-3xl font-black text-[#f5a623] mt-1">44.123</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs font-bold text-[#0d2461]">UNIÃO BRASIL</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROPOSTAS + FORMULÁRIO ── */}
      <section id="propostas" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-14">

            {/* Propostas */}
            <div>
              <p className="text-[#f5a623] font-bold text-xs uppercase tracking-widest">Nossas</p>
              <h2 className="text-3xl font-black text-[#0d2461] mt-1">
                Propostas
                <span className="block w-12 h-1 bg-[#f5a623] mt-2 rounded" />
              </h2>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {PROPOSALS.map((p) => (
                  <div key={p.title} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">{p.icon}</div>
                    <h3 className="font-bold text-[#0d2461] text-xs leading-snug">{p.title}</h3>
                    <p className="text-[11px] text-gray-400 mt-1">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulário */}
            <div id="participe">
              <p className="text-[#f5a623] font-bold text-xs uppercase tracking-widest">Faça Parte da</p>
              <h2 className="text-3xl font-black text-[#0d2461] mt-1">
                Campanha
                <span className="block w-12 h-1 bg-[#f5a623] mt-2 rounded" />
              </h2>
              <div className="mt-8">
                <CampaignContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AGENDA ── */}
      <section id="agenda" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[#f5a623] font-bold text-xs uppercase tracking-widest">Agenda da</p>
          <h2 className="text-3xl font-black text-[#0d2461] mt-1">
            Campanha
            <span className="block w-12 h-1 bg-[#f5a623] mt-2 rounded" />
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AGENDA.map((event) => (
              <div key={event.title} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-50 rounded-xl px-3 py-2 text-center min-w-[56px]">
                    <p className="text-2xl font-black text-[#0d2461] leading-none">{event.day}</p>
                    <p className="text-xs font-bold text-blue-400 mt-0.5">{event.month}</p>
                  </div>
                </div>
                <h3 className="font-bold text-[#0d2461] text-sm leading-snug">{event.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{event.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">{event.local}</p>
                <button className="mt-4 w-full bg-[#0d2461] hover:bg-blue-800 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                  Participar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REDES SOCIAIS ── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[#f5a623] font-bold text-xs uppercase tracking-widest">Acompanhe nas</p>
          <h2 className="text-3xl font-black text-[#0d2461] mt-1">
            Redes Sociais
            <span className="block w-12 h-1 bg-[#f5a623] mt-2 rounded" />
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                  style={{ backgroundColor: s.color }}
                >
                  {s.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0d2461] text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400 truncate">{s.handle}</p>
                </div>
                <span className="text-gray-300 font-bold">›</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── RODAPÉ ── */}
      <footer id="contato" className="bg-[#0d2461] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="font-black text-white text-base leading-tight">UNIÃO<br />BRASIL</span>
              <span className="font-black text-[#f5a623] text-4xl leading-none ml-1">44</span>
            </div>
            <p className="font-bold text-blue-200 text-sm">{name}</p>
            <p className="text-blue-400 text-xs">Candidato a Vereador</p>
            <p className="font-black text-[#f5a623] text-3xl mt-2">44.123</p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-blue-400 mb-4">Links rápidos</h3>
            {['Início', 'Propostas', 'Agenda', 'Participe', 'Contato'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="flex items-center justify-between py-2 border-b border-blue-800/50 text-blue-200 hover:text-white text-sm transition-colors"
              >
                {link}
                <span className="text-blue-500">›</span>
              </a>
            ))}
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-blue-400 mb-4">Fale conosco</h3>
            <ul className="space-y-3 text-sm text-blue-200">
              <li>📞 (11) 99999-9999</li>
              <li>✉️ contato@nomedocandidato.com.br</li>
              <li>
                📍 Rua das Flores, 123<br />
                <span className="ml-5">Centro — Sua Cidade/UF</span>
              </li>
              <li>🕐 Segunda a Sexta, 9h às 18h</li>
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-blue-400 mb-4">Sobre a campanha</h3>
            <p className="text-sm text-blue-200 leading-relaxed">
              Nosso compromisso é com transparência, trabalho sério e respeito por cada cidadão.
            </p>
            <p className="text-sm text-blue-200 leading-relaxed mt-3">
              Este site é um canal oficial de comunicação da campanha.
            </p>
            <div className="flex items-center gap-1 mt-5">
              <span className="font-black text-white text-sm">UNIÃO</span>
              <span className="font-black text-[#f5a623] text-sm ml-1">BRASIL 44</span>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-blue-500">
            <p>© 2024 {name}. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <p>Desenvolvido com ❤️ para nossa cidade.</p>
              <a href="/login" className="text-blue-800 hover:text-blue-600 text-xs transition-colors">Área da equipe</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
