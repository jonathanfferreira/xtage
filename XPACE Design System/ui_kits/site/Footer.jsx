function Footer() {
  const cols = [
    {h:"Escola",links:["Filosofia","Estilos","Grade","Planos"]},
    {h:"Company",links:["Crew","Performances","Awards","Press"]},
    {h:"Contato",links:["Joinville · SC","WhatsApp","Instagram","Email"]},
  ];
  return (
    <footer style={{background:"#050505",color:"#fff",padding:"80px 32px 32px",position:"relative",overflow:"hidden",borderTop:"1px solid #1f1f1f"}}>
      <div aria-hidden="true" style={{position:"absolute",left:0,right:0,bottom:-30,fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:"24vw",lineHeight:0.85,opacity:0.04,letterSpacing:"-0.04em",textTransform:"uppercase",pointerEvents:"none",userSelect:"none",textAlign:"center"}}>XPACE</div>
      <div style={{maxWidth:1280,margin:"0 auto",position:"relative"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.4fr repeat(3,1fr)",gap:40,marginBottom:56}}>
          <div>
            <img src="../../assets/logo/xpace-logo-white.png" alt="XPACE" style={{height:32,marginBottom:18}}/>
            <p style={{fontFamily:"var(--xp-font-body)",fontWeight:700,fontSize:13,letterSpacing:"0.04em",textTransform:"uppercase",color:"#a0a0a0",lineHeight:1.55,maxWidth:320,margin:0}}>
              Redefinindo movimento através de tecnologia e paixão. Joinville-SC.
            </p>
          </div>
          {cols.map(c => (
            <div key={c.h}>
              <div style={{fontFamily:"var(--xp-font-tech)",fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"#6324b2",marginBottom:18}}>{c.h}</div>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:10}}>
                {c.links.map(l => (
                  <li key={l}><a href="#" style={{color:"#fff",textDecoration:"none",fontFamily:"var(--xp-font-body)",fontWeight:600,fontSize:13,letterSpacing:"0.04em",textTransform:"uppercase"}}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid #1f1f1f",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{fontFamily:"var(--xp-font-tech)",fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:"#666"}}>© 2026 Escola XPACE · Todos os direitos reservados</div>
          <div style={{display:"flex",gap:10}}>
            {["mail","call","location_on"].map(i => (
              <a key={i} href="#" style={{width:38,height:38,borderRadius:9999,border:"1px solid #1f1f1f",display:"grid",placeItems:"center",color:"#fff",textDecoration:"none"}}>
                <span className="material-symbols-outlined" style={{fontSize:18}}>{i}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
