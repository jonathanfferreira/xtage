function FeatureGrid() {
  const rooms = [
    {tag:"01 // Educação", title:"Xperience", desc:"Aulas de Hip Hop, Jazz Funk, K-Pop, Heels, Ballet. Do iniciante ao avançado.", color:"#6324b2", icon:"school"},
    {tag:"02 // Criativo", title:"Xlab", desc:"Coreografia, criação, processos artísticos. Onde nascem as competições.", color:"#eb00bc", icon:"movie_creation"},
    {tag:"03 // Atletismo", title:"Xcore", desc:"Condicionamento físico, alongamento, fight. Corpo afiado para o palco.", color:"#ff5200", icon:"fitness_center"},
    {tag:"04 // Tecnologia", title:"Xtage", desc:"Plataforma gamificada e holo-deck. Treine em qualquer lugar, do seu ritmo.", color:"#ffd700", icon:"festival"},
  ];
  return (
    <section style={{background:"#050505",color:"#fff",padding:"96px 32px",position:"relative",overflow:"hidden"}}>
      <div aria-hidden="true" style={{position:"absolute",left:"-10%",top:"-10%",width:"80%",height:"80%",background:"radial-gradient(circle, rgba(99,36,178,0.15) 0%, transparent 60%)",pointerEvents:"none"}}/>
      <div style={{maxWidth:1280,margin:"0 auto",position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
          <span style={{height:1,width:40,background:"#eb00bc"}}/>
          <span style={{fontFamily:"var(--xp-font-tech)",fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:"#eb00bc"}}>O Universo XPACE</span>
        </div>
        <h2 style={{fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:64,lineHeight:0.9,letterSpacing:"-0.02em",textTransform:"uppercase",margin:"0 0 56px",maxWidth:780}}>
          Quatro Ambientes.<br/>
          <span style={{background:"linear-gradient(90deg,#6324b2,#eb00bc,#ff5200)",WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent"}}>Uma Só Visão.</span>
        </h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {rooms.map(r => (
            <div key={r.title} style={{background:"#0a0a0a",padding:"24px 22px 22px",borderLeft:`4px solid ${r.color}`,position:"relative",overflow:"hidden",minHeight:240,clipPath:"polygon(20px 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%,0 20px)"}}>
              <span aria-hidden="true" className="material-symbols-outlined" style={{position:"absolute",top:14,right:14,fontSize:96,opacity:0.06,color:r.color}}>{r.icon}</span>
              <div style={{fontFamily:"var(--xp-font-tech)",fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:r.color,marginBottom:14}}>{r.tag}</div>
              <h3 style={{fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:36,letterSpacing:"-0.01em",textTransform:"uppercase",margin:"0 0 16px",lineHeight:0.95}}>{r.title}</h3>
              <p style={{fontSize:13,color:"#a0a0a0",lineHeight:1.55,borderLeft:"1px solid #1f1f1f",paddingLeft:12,margin:"0 0 18px"}}>{r.desc}</p>
              <div style={{borderTop:"1px dashed #1f1f1f",paddingTop:12,fontFamily:"var(--xp-font-tech)",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:"#fff",display:"flex",alignItems:"center",gap:8}}>
                Saiba Mais <span className="material-symbols-outlined" style={{fontSize:14}}>arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.FeatureGrid = FeatureGrid;
