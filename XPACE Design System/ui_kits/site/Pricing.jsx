function Pricing() {
  const plans = [
    {name:"Mensal", price:"R$229", period:"/mês", note:"Sem fidelidade", cta:"Começar Agora", highlight:false, color:"#a0a0a0"},
    {name:"Trimestral", price:"R$199", period:"/mês", note:"Fidelidade 90 dias", cta:"Garantir Trimestral", highlight:false, color:"#eb00bc"},
    {name:"Anual", price:"R$165", period:"/mês", note:"Melhor Valor · 12x", cta:"Garantir Anual", highlight:true, color:"#6324b2"},
  ];
  return (
    <section style={{background:"#fff",color:"#050505",padding:"96px 32px",position:"relative"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
          <span style={{height:1,width:40,background:"#6324b2"}}/>
          <span style={{fontFamily:"var(--xp-font-tech)",fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:"#6324b2"}}>Planos · Escolha Seu</span>
        </div>
        <h2 style={{fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:72,lineHeight:0.9,letterSpacing:"-0.02em",textTransform:"uppercase",margin:"0 0 56px"}}>Acesso Premium.</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr) 1.1fr",gap:20}}>
          {plans.map(p => (
            <div key={p.name} style={{position:"relative",background:p.highlight?"#050505":"#f8f8f8",color:p.highlight?"#fff":"#050505",padding:"32px 28px",border:p.highlight?"none":"1px solid #e5e5e5",clipPath:"polygon(20px 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%,0 20px)",minHeight:380,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              {p.highlight && <div style={{position:"absolute",top:0,right:0,background:"linear-gradient(90deg,#6324b2,#eb00bc)",color:"#fff",padding:"6px 14px",fontFamily:"var(--xp-font-tech)",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",clipPath:"polygon(15px 0,100% 0,100% 100%,0 100%)"}}>Melhor Valor</div>}
              <div>
                <div style={{fontFamily:"var(--xp-font-tech)",fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:p.color,marginBottom:14}}>{p.note}</div>
                <h3 style={{fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:40,letterSpacing:"-0.02em",textTransform:"uppercase",margin:"0 0 24px",lineHeight:1}}>{p.name}</h3>
                <div style={{fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:64,letterSpacing:"-0.03em",lineHeight:1}}>
                  {p.price}<span style={{fontFamily:"var(--xp-font-body)",fontSize:18,fontWeight:400,color:p.highlight?"#a0a0a0":"#666",letterSpacing:0}}>{p.period}</span>
                </div>
                <div style={{borderTop:"1px dashed " + (p.highlight?"#1f1f1f":"#e5e5e5"),margin:"24px 0"}}/>
                <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:10}}>
                  {["Acesso Ilimitado","Todas as Modalidades","Eventos Inclusos"].map(f => (
                    <li key={f} style={{fontFamily:"var(--xp-font-body)",fontSize:13,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase",display:"flex",gap:8,alignItems:"center"}}>
                      <span className="material-symbols-outlined" style={{fontSize:18,color:p.color}}>check_circle</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
              <button style={{marginTop:24,background:p.highlight?"#fff":"#050505",color:p.highlight?"#050505":"#fff",fontFamily:"var(--xp-font-tech)",fontSize:12,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:700,padding:"14px 18px",border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"space-between",gap:8,clipPath:"polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)"}}>
                {p.cta}<span className="material-symbols-outlined" style={{fontSize:16}}>arrow_forward</span>
              </button>
            </div>
          ))}
          {/* PASSE LIVRE */}
          <div style={{position:"relative",padding:2,background:"linear-gradient(135deg,#ffd700,#fdb931,#ffd700)",clipPath:"polygon(20px 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%,0 20px)",boxShadow:"0 0 30px rgba(255,215,0,0.3)"}}>
            <div style={{background:"#0a0a0a",color:"#fff",padding:"32px 28px",height:"100%",clipPath:"polygon(20px 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%,0 20px)",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative",overflow:"hidden"}}>
              <div aria-hidden="true" style={{position:"absolute",inset:0,background:"linear-gradient(105deg, transparent 30%, rgba(255,215,0,0.1) 50%, transparent 70%)",pointerEvents:"none"}}/>
              <div>
                <div style={{fontFamily:"var(--xp-font-tech)",fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"#ffd700",marginBottom:14}}>VIP · Passe Livre</div>
                <h3 style={{fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:40,letterSpacing:"-0.02em",textTransform:"uppercase",margin:"0 0 8px",lineHeight:1,background:"linear-gradient(90deg,#ffd700,#fdb931)",WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent"}}>Anual VIP</h3>
                <div style={{fontFamily:"var(--xp-font-tech)",fontSize:11,letterSpacing:"0.22em",color:"#a0a0a0",textTransform:"uppercase",marginBottom:18}}>Acesso Ilimitado · Tudo Incluso</div>
                <div style={{fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:64,letterSpacing:"-0.03em",lineHeight:1}}>
                  R$499<span style={{fontFamily:"var(--xp-font-body)",fontSize:18,fontWeight:400,color:"#a0a0a0",letterSpacing:0}}>/mês</span>
                </div>
                <div style={{borderTop:"1px dashed #1f1f1f",margin:"24px 0"}}/>
                <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:10}}>
                  {["Tudo do Anual","Eventos VIP","Performances Exclusivas","Backstage XPACE"].map(f => (
                    <li key={f} style={{fontFamily:"var(--xp-font-body)",fontSize:13,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase",display:"flex",gap:8,alignItems:"center"}}>
                      <span className="material-symbols-outlined" style={{fontSize:18,color:"#ffd700"}}>check_circle</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
              <button style={{marginTop:24,background:"#ffd700",color:"#050505",fontFamily:"var(--xp-font-tech)",fontSize:12,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:900,padding:"14px 18px",border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"space-between",gap:8,clipPath:"polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)"}}>
                Quero Ser VIP<span className="material-symbols-outlined" style={{fontSize:16}}>arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Pricing = Pricing;
