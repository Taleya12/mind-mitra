// src/App.jsx — Mind Mitra (Firebase Edition)
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, doc, setDoc, getDoc, addDoc, updateDoc,
  onSnapshot, query, where, orderBy, serverTimestamp,
} from "firebase/firestore";

// ─── FIREBASE CONFIG ──────────────────────────────────────────────────────────
// Paste YOUR values from Firebase Console → Project Settings → Your Apps
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyBkIX13PxykVnVBsX7HWhcN48acp9s8O-E",
  authDomain:        "mind-mitra-37f85.firebaseapp.com",
  projectId:         "mind-mitra-37f85",
  storageBucket:     "mind-mitra-37f85.firebasestorage.app",
  messagingSenderId: "889960062685",
  appId:             "1:889960062685:web:098fd29ff9584ff4490534",
};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
// ─────────────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0d1117;--surf:#161b22;--surf2:#1e2530;--brd:#30363d;
  --acc:#58c4a0;--pur:#7b68ee;--pnk:#ff7eb3;
  --warn:#f0a500;--red:#ff4d4f;--txt:#e6edf3;--mut:#8b949e;
  --r:14px;--font:'Sora',sans-serif;--serif:'DM Serif Display',serif;
}
body{background:var(--bg);color:var(--txt);font-family:var(--font)}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--brd);border-radius:3px}
.app{display:flex;min-height:100vh}
.auth-pg{min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(ellipse at 20% 50%,rgba(88,196,160,.07),transparent 60%),
  radial-gradient(ellipse at 80% 20%,rgba(123,104,238,.07),transparent 60%),var(--bg);padding:24px}
.auth-box{background:var(--surf);border:1px solid var(--brd);border-radius:22px;padding:40px;width:100%;max-width:460px;box-shadow:0 24px 64px rgba(0,0,0,.5)}
.a-logo{font-family:var(--serif);font-size:2rem;color:var(--acc);text-align:center;margin-bottom:4px}
.a-tag{text-align:center;color:var(--mut);font-size:.72rem;letter-spacing:2px;text-transform:uppercase;margin-bottom:28px}
.a-title{font-family:var(--serif);font-size:1.5rem;margin-bottom:6px}
.a-sub{color:var(--mut);font-size:.8rem;margin-bottom:22px}
.a-link{color:var(--acc);cursor:pointer;font-size:.8rem;text-decoration:underline}
.a-foot{text-align:center;margin-top:16px;font-size:.78rem;color:var(--mut)}
.rc{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}
.rc-card{padding:14px;border-radius:12px;border:1.5px solid var(--brd);background:transparent;cursor:pointer;text-align:center;transition:all .2s}
.rc-card:hover{border-color:var(--acc)}.rc-card.s{border-color:var(--acc);background:rgba(88,196,160,.08);box-shadow:0 0 0 2px rgba(88,196,160,.2)}
.sb{display:flex;gap:4px;margin-top:6px}.ss{flex:1;height:3px;border-radius:2px;background:var(--brd);transition:background .3s}
.err{color:var(--red);font-size:.73rem;margin-top:4px}
.ig{position:relative}.ig-i{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:.9rem}
.ig-r{position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:.9rem;color:var(--mut)}.igl{padding-left:36px!important}
.sidebar{width:235px;min-height:100vh;background:var(--surf);border-right:1px solid var(--brd);display:flex;flex-direction:column;padding:22px 14px;position:fixed;top:0;left:0;z-index:10;overflow-y:auto}
.s-logo{font-family:var(--serif);font-size:1.25rem;color:var(--acc);margin-bottom:3px}
.s-sub{font-size:.6rem;color:var(--mut);margin-bottom:24px;text-transform:uppercase;letter-spacing:2px}
.ni{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:10px;cursor:pointer;font-size:.8rem;color:var(--mut);margin-bottom:3px;transition:all .2s;border:1px solid transparent}
.ni:hover{color:var(--txt);background:var(--surf2)}.ni.act{color:var(--acc);background:rgba(88,196,160,.08);border-color:rgba(88,196,160,.2)}
.ni-ic{font-size:.95rem;width:20px;text-align:center}
.ub{margin-top:auto;background:var(--surf2);border-radius:10px;padding:11px}
.ub-n{font-weight:600;font-size:.84rem;color:var(--txt)}.ub-r{font-size:.67rem;color:var(--mut);margin-top:2px}
.ub-lo{margin-top:9px;width:100%;padding:6px;border-radius:8px;background:transparent;border:1px solid var(--brd);color:var(--red);font-family:var(--font);font-size:.7rem;cursor:pointer;transition:all .2s}
.ub-lo:hover{background:rgba(255,77,79,.08);border-color:var(--red)}
.main{margin-left:235px;flex:1;padding:28px 32px;max-width:calc(100vw - 235px);overflow-x:hidden}
.pt{font-family:var(--serif);font-size:1.9rem;color:var(--txt);margin-bottom:4px}
.ps{color:var(--mut);font-size:.8rem;margin-bottom:22px}
.card{background:var(--surf);border:1px solid var(--brd);border-radius:var(--r);padding:20px}
.ct{font-size:.73rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--mut);margin-bottom:12px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.sc{background:var(--surf);border:1px solid var(--brd);border-radius:var(--r);padding:18px 20px}
.al-r{background:rgba(255,77,79,.09);border:1px solid rgba(255,77,79,.3);border-radius:var(--r);padding:13px 16px;display:flex;align-items:center;gap:11px;margin-bottom:16px}
.al-w{background:rgba(240,165,0,.09);border:1px solid rgba(240,165,0,.3);border-radius:var(--r);padding:13px 16px;display:flex;align-items:center;gap:11px;margin-bottom:16px}
.al-g{background:rgba(88,196,160,.09);border:1px solid rgba(88,196,160,.3);border-radius:var(--r);padding:13px 16px;display:flex;align-items:center;gap:11px;margin-bottom:16px}
.al-b{background:rgba(123,104,238,.09);border:1px solid rgba(123,104,238,.3);border-radius:var(--r);padding:13px 16px;display:flex;align-items:center;gap:11px;margin-bottom:16px}
.btn{padding:9px 18px;border-radius:10px;border:none;cursor:pointer;font-family:var(--font);font-size:.81rem;font-weight:600;transition:all .2s;white-space:nowrap}
.btn-g{background:var(--acc);color:var(--bg)}.btn-g:hover{background:#4db891;box-shadow:0 4px 14px rgba(88,196,160,.3)}
.btn-o{background:transparent;border:1.5px solid var(--brd);color:var(--txt)}.btn-o:hover{border-color:var(--acc);color:var(--acc)}
.btn-r{background:rgba(255,77,79,.12);color:var(--red);border:1.5px solid var(--red)}
.btn-p{background:var(--pur);color:#fff}.btn-p:hover{background:#6a58d4}
.btn-w{background:rgba(240,165,0,.12);color:var(--warn);border:1.5px solid var(--warn)}
.btn-sm{padding:5px 12px;font-size:.73rem}
.bdg{padding:3px 9px;border-radius:50px;font-size:.66rem;font-weight:600;display:inline-block}
.b-g{background:rgba(88,196,160,.12);color:var(--acc)}.b-m{background:rgba(139,148,158,.12);color:var(--mut)}
.b-r{background:rgba(255,77,79,.12);color:var(--red)}.b-w{background:rgba(240,165,0,.12);color:var(--warn)}
.b-p{background:rgba(123,104,238,.12);color:var(--pur)}
.sr{background:var(--surf2);border:1px solid var(--brd);border-radius:var(--r);padding:15px 16px;display:flex;align-items:center;gap:13px;margin-bottom:9px}
.sr-ic{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.ic-v{background:rgba(123,104,238,.15)}.ic-p{background:rgba(88,196,160,.15)}.ic-i{background:rgba(255,126,179,.15)}
.sr-info{flex:1;min-width:0}.sr-t{font-size:.86rem;font-weight:600}.sr-m{font-size:.72rem;color:var(--mut);margin-top:2px}
.cancelled-row{opacity:.5}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--surf);border:1px solid var(--brd);border-radius:18px;padding:26px;width:100%;max-width:490px;max-height:90vh;overflow-y:auto}
.m-t{font-family:var(--serif);font-size:1.35rem;margin-bottom:5px}.m-s{color:var(--mut);font-size:.78rem;margin-bottom:18px}
.fg{margin-bottom:13px}.fl{font-size:.71rem;color:var(--mut);margin-bottom:5px;display:block;text-transform:uppercase;letter-spacing:.8px}
.fi{width:100%;padding:9px 13px;background:var(--surf2);border:1.5px solid var(--brd);border-radius:10px;color:var(--txt);font-family:var(--font);font-size:.84rem;outline:none;transition:border-color .2s}
.fi:focus{border-color:var(--acc)}.fta{resize:vertical;min-height:80px}.frow{display:flex;gap:11px}.frow .fg{flex:1}
.tabs{display:flex;gap:4px;background:var(--surf2);border-radius:12px;padding:4px;margin-bottom:18px}
.tab{flex:1;padding:7px 10px;border-radius:9px;border:none;background:transparent;color:var(--mut);font-family:var(--font);font-size:.77rem;cursor:pointer;transition:all .2s;white-space:nowrap}
.tab.act{background:var(--surf);color:var(--txt);font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.3)}
.mg{display:flex;gap:7px;flex-wrap:wrap;margin-top:6px}
.mb2{padding:8px 13px;border-radius:50px;border:1.5px solid var(--brd);background:transparent;color:var(--txt);font-family:var(--font);font-size:.79rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:5px}
.mb2:hover,.mb2.s{border-color:var(--acc);background:rgba(88,196,160,.08);color:var(--acc)}.mb2.s{box-shadow:0 0 0 2px rgba(88,196,160,.2)}
input[type=range]{width:100%;-webkit-appearance:none;height:6px;border-radius:3px;background:var(--brd);outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:17px;height:17px;border-radius:50%;background:var(--acc);cursor:pointer;border:2px solid var(--bg)}
.chart{display:flex;align-items:flex-end;gap:5px;height:75px}
.bar{flex:1;background:var(--acc);border-radius:3px 3px 0 0;opacity:.75;min-height:3px}
.bar.dr{background:var(--red)}.bar.wr{background:var(--warn)}
.clb{display:flex;gap:5px;margin-top:5px}.cl{flex:1;text-align:center;font-size:.6rem;color:var(--mut)}
.pc{border:1.5px solid var(--brd);border-radius:13px;padding:15px;cursor:pointer;transition:all .2s;position:relative}
.pc:hover{border-color:var(--pur)}.pc.s{border-color:var(--pur);background:rgba(123,104,238,.06);box-shadow:0 0 0 2px rgba(123,104,238,.18)}
.pp{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:var(--pur);color:#fff;font-size:.59rem;font-weight:700;padding:2px 9px;border-radius:20px;white-space:nowrap}
.pm{flex:1;padding:9px;border-radius:10px;border:1.5px solid var(--brd);background:transparent;cursor:pointer;text-align:center;transition:all .2s;font-size:.76rem;color:var(--mut)}
.pm:hover,.pm.act{border-color:var(--pur);color:var(--txt);background:rgba(123,104,238,.06)}
.pm-i{font-size:1.1rem;display:block;margin-bottom:3px}
.txr{display:flex;align-items:center;gap:11px;padding:10px 0;border-bottom:1px solid var(--brd)}
.rw-card{background:var(--surf2);border:1px solid var(--brd);border-radius:var(--r);padding:16px;text-align:center;transition:all .2s}
.rw-card.unlocked{border-color:var(--acc);background:rgba(88,196,160,.06)}.rw-card.locked{opacity:.5}
.prog-bar{width:100%;height:8px;background:var(--brd);border-radius:4px;overflow:hidden;margin-top:6px}
.prog-fill{height:100%;border-radius:4px;transition:width .6s ease}
.chat-wrap{display:flex;flex-direction:column;background:var(--surf2);border-radius:var(--r);overflow:hidden;border:1px solid var(--brd)}
.chat-msgs{overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:9px;height:340px}
.chat-bubble{max-width:72%;padding:9px 13px;border-radius:14px;font-size:.79rem;line-height:1.5;word-break:break-word}
.chat-bubble.me{background:rgba(88,196,160,.14);border:1px solid rgba(88,196,160,.24);align-self:flex-end;border-bottom-right-radius:4px}
.chat-bubble.them{background:var(--surf);border:1px solid var(--brd);align-self:flex-start;border-bottom-left-radius:4px}
.chat-input-row{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--brd);background:var(--surf)}
.room-banner{background:linear-gradient(135deg,rgba(88,196,160,.13),rgba(123,104,238,.13));border:1px solid rgba(88,196,160,.3);border-radius:var(--r);padding:20px;text-align:center;margin-bottom:16px}
.join-btn{background:linear-gradient(135deg,var(--acc),var(--pur));color:#fff;border:none;border-radius:12px;padding:12px 24px;font-family:var(--font);font-size:.88rem;font-weight:700;cursor:pointer;transition:all .25s;box-shadow:0 4px 18px rgba(88,196,160,.3)}
.join-btn:hover{transform:translateY(-2px)}
.reminder-popup{position:fixed;bottom:22px;right:22px;z-index:300;background:var(--surf);border:2px solid var(--acc);border-radius:16px;padding:16px 20px;min-width:300px;box-shadow:0 12px 40px rgba(0,0,0,.5);animation:sli .4s ease}
.health-tag{display:inline-block;padding:4px 10px;border-radius:20px;font-size:.72rem;margin:3px;cursor:pointer;border:1.5px solid var(--brd);transition:all .2s}
.health-tag.sel{border-color:var(--acc);background:rgba(88,196,160,.1);color:var(--acc)}
.note-card{background:var(--surf2);border-left:3px solid var(--pur);border-radius:0 var(--r) var(--r) 0;padding:13px 15px;margin-bottom:9px}
.mem-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;max-width:300px;margin:0 auto}
.mc{aspect-ratio:1;border-radius:10px;border:2px solid var(--brd);background:var(--surf2);display:flex;align-items:center;justify-content:center;font-size:1.3rem;cursor:pointer;transition:all .3s}
.mc.fl2,.mc.mt{background:rgba(88,196,160,.1);border-color:var(--acc)}.mc.mt{opacity:.5;pointer-events:none}
.notif{position:fixed;top:18px;right:18px;z-index:200;background:var(--surf);border:1px solid var(--acc);border-radius:12px;padding:13px 17px;min-width:260px;box-shadow:0 8px 28px rgba(0,0,0,.4);animation:sli .3s ease}
@keyframes sli{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes pop{0%{transform:scale(0);opacity:0}80%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.fb{display:flex;justify-content:space-between;align-items:center}
.mt3{margin-top:12px}.mt4{margin-top:16px}.mb3{margin-bottom:12px}.mb4{margin-bottom:16px}
.empty{text-align:center;padding:44px 20px;color:var(--mut);font-size:.83rem;line-height:1.7}
.ei{font-size:2.4rem;margin-bottom:10px}
`;

const MOODS=[{e:"😄",l:"Great",s:92},{e:"😊",l:"Good",s:72},{e:"😐",l:"Okay",s:50},{e:"😟",l:"Low",s:28},{e:"😰",l:"Awful",s:10}];
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MEM_E=["🌸","🌊","🍃","☁️","🌙","⭐","🦋","🌈"];
const PLANS=[{id:"basic",n:"Basic",p:499,d:"1 session / month"},{id:"standard",n:"Standard",p:999,d:"3 sessions / month",pop:true},{id:"premium",n:"Premium",p:1799,d:"Unlimited sessions"}];
const TRIGGERS=["Academic pressure","Family issues","Relationship problems","Financial stress","Sleep issues","Social anxiety","Loneliness","Career stress","Health concerns","Peer pressure"];
const COPING=["Deep breathing","Exercise","Journaling","Talking to friends","Meditation","Music","Reading","Walking","Creative activities","Sleeping"];
const BADGES=[
  {id:"first_checkin",icon:"🌱",name:"First Step",desc:"Complete your first check-in",xp:50,check:d=>d.checkins>=1},
  {id:"week_streak",icon:"🔥",name:"Week Warrior",desc:"7 check-ins completed",xp:100,check:d=>d.checkins>=7},
  {id:"paid_session",icon:"⭐",name:"Session Star",desc:"Pay for your first session",xp:80,check:d=>d.txns>=1},
  {id:"gratitude",icon:"🌸",name:"Gratitude",desc:"Complete the gratitude game",xp:60,check:d=>d.gratitude_played},
  {id:"breath",icon:"🫁",name:"Breathe Easy",desc:"Complete a breathing exercise",xp:60,check:d=>d.breath_played},
  {id:"profile_done",icon:"💪",name:"Know Yourself",desc:"Fill in your health profile",xp:70,check:d=>d.profile_done},
  {id:"month_streak",icon:"🏆",name:"Month Master",desc:"30 check-ins completed",xp:300,check:d=>d.checkins>=30},
];

// Firebase helpers
const FB={
  async getUser(email){const s=await getDoc(doc(db,"users",email));return s.exists()?s.data():null;},
  async saveUser(email,data){await setDoc(doc(db,"users",email),data,{merge:true});},
  async getAllUsers(){const{getDocs}=await import("firebase/firestore");const s=await getDocs(collection(db,"users"));return s.docs.map(d=>d.data());},
  async addSession(s){const r=await addDoc(collection(db,"sessions"),{...s,createdAt:serverTimestamp()});await updateDoc(r,{id:r.id});return r.id;},
  async updateSession(id,data){await updateDoc(doc(db,"sessions",id),data);},
  async saveCheckin(email,entry){await setDoc(doc(db,"checkins",`${email}_${entry.date.replace(/\//g,"-")}`),{...entry,userEmail:email});},
  async addNote(note){await addDoc(collection(db,"notes"),{...note,createdAt:serverTimestamp()});},
  async addTxn(txn){await addDoc(collection(db,"transactions"),{...txn,createdAt:serverTimestamp()});},
  async sendMsg(toEmail,fromName,fromEmail,subject,body,type="info"){await addDoc(collection(db,"messages"),{toEmail,fromName,fromEmail,subject,body,type,date:new Date().toLocaleDateString(),read:false,createdAt:serverTimestamp()});},
  async sendChat(chatId,msg){await addDoc(collection(db,"chats",chatId,"messages"),{...msg,createdAt:serverTimestamp()});},
};

export default function App(){
  const[screen,setScreen]=useState("login");
  const[user,setUser]=useState(null);
  const[page,setPage]=useState("dashboard");
  const[notif,setNotif]=useState(null);
  const[reminder,setReminder]=useState(null);
  const[showBook,setShowBook]=useState(false);
  const[showPay,setShowPay]=useState(null);
  const[showResc,setShowResc]=useState(null);
  const[showNote,setShowNote]=useState(null);
  const[showRoom,setShowRoom]=useState(null);
  const[activeGame,setActiveGame]=useState(null);
  const[sessions,setSessions]=useState([]);
  const[checkins,setCheckins]=useState([]);
  const[txns,setTxns]=useState([]);
  const[notes,setNotes]=useState([]);
  const[inbox,setInbox]=useState([]);
  const[profile,setProfile]=useState({triggers:[],coping:[],history:"",medications:"",therapyHistory:""});
  const[badgeData,setBadgeData]=useState({checkins:0,txns:0,gratitude_played:false,breath_played:false,profile_done:false});
  const[allUsers,setAllUsers]=useState([]);

  const notify=(title,msg,color="green")=>{setNotif({title,msg,color});setTimeout(()=>setNotif(null),4000);};

  useEffect(()=>{
    FB.getAllUsers().then(u=>setAllUsers(u)).catch(()=>{});
  },[screen]);

  useEffect(()=>{
    if(!user)return;
    const unsubs=[];
    const sQ=user.role==="student"
      ?query(collection(db,"sessions"),where("studentEmail","==",user.email))
      :query(collection(db,"sessions"),where("counselorEmail","==",user.email));
    unsubs.push(onSnapshot(sQ,snap=>{
      setSessions(snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
    }));
    const ciQ=query(collection(db,"checkins"),where("userEmail","==",user.email));
    unsubs.push(onSnapshot(ciQ,snap=>{
      const all=snap.docs.map(d=>d.data()).sort((a,b)=>new Date(a.date)-new Date(b.date));
      setCheckins(all);
      setBadgeData(p=>({...p,checkins:all.length}));
    }));
    const txQ=query(collection(db,"transactions"),where("userEmail","==",user.email));
    unsubs.push(onSnapshot(txQ,snap=>{
      setTxns(snap.docs.map(d=>d.data()).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
      setBadgeData(p=>({...p,txns:snap.docs.length}));
    }));
    const nField=user.role==="counselor"?"counselorEmail":"studentEmail";
    const nQ=query(collection(db,"notes"),where(nField,"==",user.email));
    unsubs.push(onSnapshot(nQ,snap=>{
      setNotes(snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
    }));
    const mQ=query(collection(db,"messages"),where("toEmail","==",user.email));
    unsubs.push(onSnapshot(mQ,snap=>{
      setInbox(snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
    }));
    FB.getUser(user.email).then(u=>{
      if(u?.profile)setProfile(u.profile);
      if(u?.badgeData)setBadgeData(p=>({...p,...u.badgeData}));
    });
    return()=>unsubs.forEach(u=>u());
  },[user]);

  useEffect(()=>{
    if(!user||!sessions.length)return;
    const check=()=>{
      const now=new Date();
      sessions.forEach(s=>{
        if(s.status!=="upcoming"||!s.date||!s.time)return;
        try{
          const dt=new Date(`${s.date} ${s.time}`);
          const diff=(dt-now)/60000;
          if(diff>0&&diff<=10){
            const key=`reminded_${s.id}`;
            if(!sessionStorage.getItem(key)){
              sessionStorage.setItem(key,"1");
              setReminder(s);
              if(Notification.permission==="granted"){
                new Notification("🔔 Mind Mitra — Session in 10 minutes!",{body:`Session with ${user.role==="student"?s.counselor:s.student} starts soon.`});
              }else if(Notification.permission!=="denied"){Notification.requestPermission();}
            }
          }
        }catch{}
      });
    };
    check();const iv=setInterval(check,30000);return()=>clearInterval(iv);
  },[user,sessions]);

  const sendMessage=async(toEmail,subject,body,type="info")=>{
    if(!toEmail)return;
    await FB.sendMsg(toEmail,user.name,user.email,subject,body,type);
  };

  const login=u=>{setUser(u);setPage("dashboard");setScreen("app");};
  const logout=()=>{setUser(null);setSessions([]);setCheckins([]);setTxns([]);setNotes([]);setInbox([]);setScreen("login");setPage("dashboard");};

  const counselors=allUsers.filter(u=>u.role==="counselor");
  const students=allUsers.filter(u=>u.role==="student");
  const xp=BADGES.filter(b=>b.check(badgeData)).reduce((a,b)=>a+b.xp,0);
  const level=Math.floor(xp/100)+1;
  const unlockedBadges=BADGES.filter(b=>b.check(badgeData)).map(b=>b.id);
  const unread=inbox.filter(m=>!m.read).length;

  const sNav=[
    {id:"dashboard",i:"🏠",l:"Dashboard"},{id:"checkin",i:"💚",l:"Daily Check-In"},
    {id:"sessions",i:"📅",l:"My Sessions"},{id:"payments",i:"💳",l:"Payments"},
    {id:"chat",i:"💬",l:"Chat"},{id:"my_notes",i:"📋",l:"My Notes"},
    {id:"health",i:"🧠",l:"Health Profile"},{id:"rewards",i:"🏆",l:"Rewards"},
    {id:"games",i:"🎮",l:"Relax & Play"},{id:"history",i:"📊",l:"History"},
    {id:"inbox",i:"📬",l:"Notifications"},
  ];
  const cNav=[
    {id:"dashboard",i:"🏠",l:"Dashboard"},{id:"book",i:"📅",l:"Book Session"},
    {id:"sessions",i:"🗂️",l:"All Sessions"},{id:"students",i:"👥",l:"Students"},
    {id:"chat",i:"💬",l:"Chat"},{id:"notes",i:"📝",l:"Session Notes"},
    {id:"payments",i:"💳",l:"Payments"},{id:"alerts",i:"🚨",l:"Alerts"},
    {id:"inbox",i:"📬",l:"Notifications"},
  ];

  if(screen==="login")return<><style>{CSS}</style><LoginPage onLogin={login} onReg={()=>setScreen("register")}/></>;
  if(screen==="register")return<><style>{CSS}</style><RegisterPage onLogin={()=>setScreen("login")} onDone={()=>setScreen("login")}/></>;

  const nav=user?.role==="student"?sNav:cNav;

  return(<>
    <style>{CSS}</style>
    <div className="app">
      <aside className="sidebar">
        <div className="s-logo">🌿 Mind Mitra</div>
        <div className="s-sub">Mental Health Tracker</div>
        {nav.map(n=>(
          <div key={n.id} className={`ni ${page===n.id?"act":""}`} onClick={()=>setPage(n.id)}>
            <span className="ni-ic">{n.i}</span>{n.l}
            {n.id==="inbox"&&unread>0&&<span style={{marginLeft:"auto",background:"var(--red)",color:"#fff",borderRadius:"50%",width:17,height:17,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".62rem",fontWeight:700}}>{unread}</span>}
            {n.id==="rewards"&&xp>0&&<span style={{marginLeft:"auto",fontSize:".65rem",color:"var(--warn)",fontWeight:700}}>Lv{level}</span>}
          </div>
        ))}
        <div className="ub">
          <div className="ub-n">{user?.name}</div>
          <div className="ub-r">{user?.role==="student"?"🎓 Student":"🩺 Counselor"}{user?.college?` · ${user.college}`:""}</div>
          {user?.role==="student"&&<div style={{fontSize:".68rem",color:"var(--warn)",marginTop:4}}>⚡ {xp} XP · Level {level}</div>}
          <button className="ub-lo" onClick={logout}>🚪 Sign Out</button>
        </div>
      </aside>
      <main className="main">
        {user?.role==="student"?<>
          {page==="dashboard"&&<StudentDash user={user} sessions={sessions} checkins={checkins} xp={xp} level={level} unlockedBadges={unlockedBadges} setPage={setPage} setShowRoom={setShowRoom}/>}
          {page==="checkin"&&<CheckInPage user={user} checkins={checkins} notify={notify} badgeData={badgeData} setBadgeData={setBadgeData}/>}
          {page==="sessions"&&<MySessions user={user} sessions={sessions} setShowBook={setShowBook} setShowPay={setShowPay} setShowResc={setShowResc} setShowRoom={setShowRoom}/>}
          {page==="payments"&&<PayPage user={user} sessions={sessions} txns={txns} setShowPay={setShowPay} notify={notify} role="student"/>}
          {page==="chat"&&<ChatPage user={user} peers={counselors}/>}
          {page==="my_notes"&&<StudentNotesPage notes={notes}/>}
          {page==="health"&&<HealthProfile user={user} profile={profile} setProfile={setProfile} badgeData={badgeData} setBadgeData={setBadgeData} notify={notify}/>}
          {page==="rewards"&&<RewardsPage xp={xp} level={level} unlockedBadges={unlockedBadges}/>}
          {page==="games"&&<GamesPage activeGame={activeGame} setActiveGame={setActiveGame} user={user} badgeData={badgeData} setBadgeData={setBadgeData} notify={notify}/>}
          {page==="history"&&<HistoryPage checkins={checkins}/>}
          {page==="inbox"&&<InboxPage inbox={inbox}/>}
        </>:<>
          {page==="dashboard"&&<CounselorDash user={user} students={students} sessions={sessions} setPage={setPage}/>}
          {page==="book"&&<CounselorBook user={user} students={students} sendMessage={sendMessage} notify={notify}/>}
          {page==="sessions"&&<AllSessions sessions={sessions} setShowNote={setShowNote} setShowResc={setShowResc} setShowRoom={setShowRoom}/>}
          {page==="students"&&<StudentsPage students={students} sendMessage={sendMessage} notify={notify}/>}
          {page==="chat"&&<ChatPage user={user} peers={students}/>}
          {page==="notes"&&<NotesPage notes={notes}/>}
          {page==="payments"&&<PayPage user={user} sessions={sessions} txns={txns} setShowPay={setShowPay} notify={notify} role="counselor"/>}
          {page==="alerts"&&<AlertsPage students={students} sendMessage={sendMessage} notify={notify}/>}
          {page==="inbox"&&<InboxPage inbox={inbox}/>}
        </>}
      </main>
    </div>

    {showBook&&<div className="ov" onClick={()=>setShowBook(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <BookModal user={user} peers={counselors} forCounselor={false} sendMessage={sendMessage}
        onBook={async s=>{await FB.addSession(s);setShowBook(false);notify("✅ Session Booked!","Go to Payments to confirm.");}}
        onClose={()=>setShowBook(false)}/>
    </div></div>}

    {showResc&&<div className="ov" onClick={()=>setShowResc(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <RescheduleModal session={showResc} user={user}
        onReschedule={async(updated,reason)=>{
          await FB.updateSession(updated.id,{date:updated.date,time:updated.time,status:"upcoming",cancelMsg:null});
          const other=user.role==="student"?updated.counselorEmail:updated.studentEmail;
          await sendMessage(other,"📅 Session Rescheduled",`Rescheduled to ${updated.date} at ${updated.time}.\nReason: ${reason||"Not given"}.`,"reschedule");
          setShowResc(null);notify("📅 Rescheduled","Both parties notified.");
        }}
        onCancel={async(s,reason)=>{
          await FB.updateSession(s.id,{status:"cancelled",cancelMsg:reason||"Cancelled."});
          const other=user.role==="student"?s.counselorEmail:s.studentEmail;
          await sendMessage(other,"❌ Session Cancelled",`Session on ${s.date} at ${s.time} cancelled.\nReason: ${reason||"Not given"}.`,"cancel");
          setShowResc(null);notify("❌ Cancelled","Both parties notified.","red");
        }}
        onClose={()=>setShowResc(null)}/>
    </div></div>}

    {showNote&&<div className="ov" onClick={()=>setShowNote(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="m-t">Add Session Notes</div>
      <div className="m-s">Session with {showNote.student}</div>
      <NoteForm onSave={async text=>{
        const tl={video:"Video Call",phone:"Phone Call",person:"In-Person"};
        const note={student:showNote.student,studentEmail:showNote.studentEmail,counselor:user.name,counselorEmail:user.email,date:new Date().toLocaleDateString(),text,session:tl[showNote.type]||"Session"};
        await FB.addNote(note);
        await sendMessage(showNote.studentEmail,"📋 Session Notes Added",`${user.name} added notes from your ${tl[showNote.type]} session.`,"info");
        setShowNote(null);notify("📝 Notes Saved","Student has been notified.");
      }} onClose={()=>setShowNote(null)}/>
    </div></div>}

    {showPay&&<PayModal session={showPay} user={user} onClose={()=>setShowPay(null)} onSuccess={async s=>{
      await FB.updateSession(s.id,{paid:true});
      const icons={video:"📹",phone:"📞",person:"🏫"};
      const bgs={video:"rgba(123,104,238,.14)",phone:"rgba(88,196,160,.14)",person:"rgba(255,126,179,.14)"};
      await FB.addTxn({userEmail:user.email,desc:`${icons[s.type]||"📅"} Session — ${s.date}`,amount:s.fee,date:new Date().toLocaleDateString(),icon:icons[s.type]||"📅",bg:bgs[s.type]||bgs.video});
      setShowPay(null);notify("💳 Payment Successful!",`₹${s.fee} paid.`);
    }}/>}

    {showRoom&&<div className="ov" onClick={()=>setShowRoom(null)}><div className="modal" style={{maxWidth:560}} onClick={e=>e.stopPropagation()}>
      <SessionRoom session={showRoom} user={user} onClose={()=>setShowRoom(null)}/>
    </div></div>}

    {reminder&&<div className="reminder-popup">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div style={{fontWeight:700,fontSize:".9rem",color:"var(--acc)"}}>🔔 Session in ~10 minutes!</div>
        <span style={{cursor:"pointer",color:"var(--mut)",fontSize:"1.1rem"}} onClick={()=>setReminder(null)}>✕</span>
      </div>
      <div style={{fontSize:".78rem",color:"var(--mut)",marginBottom:12}}>
        {reminder.type==="video"?"📹 Video":reminder.type==="phone"?"📞 Phone":"🏫 In-Person"} with {user.role==="student"?reminder.counselor:reminder.student} at {reminder.time}
      </div>
      <button className="join-btn" style={{width:"100%",fontSize:".82rem",padding:"10px"}} onClick={()=>{setShowRoom(reminder);setReminder(null);}}>🚀 Open Session Room</button>
    </div>}

    {notif&&<div className="notif" style={{borderColor:notif.color==="red"?"var(--red)":notif.color==="warn"?"var(--warn)":"var(--acc)"}}>
      <div style={{fontSize:".84rem",fontWeight:600,marginBottom:3}}>{notif.title}</div>
      <div style={{fontSize:".74rem",color:"var(--mut)"}}>{notif.msg}</div>
    </div>}
  </>);
}

function LoginPage({onLogin,onReg}){
  const[email,setEmail]=useState("");const[pass,setPass]=useState("");
  const[show,setShow]=useState(false);const[err,setErr]=useState("");const[ld,setLd]=useState(false);
  const submit=async()=>{
    setErr("");if(!email||!pass){setErr("Please fill in all fields.");return;}
    setLd(true);
    try{
      const u=await FB.getUser(email.toLowerCase().trim());
      if(u&&u.pass===pass)onLogin({name:u.name,email:u.email,role:u.role,college:u.college});
      else setErr("Invalid email or password.");
    }catch{setErr("Connection error. Check internet and Firebase setup.");}
    setLd(false);
  };
  return(<div className="auth-pg"><div className="auth-box">
    <div className="a-logo">🌿 Mind Mitra</div>
    <div className="a-tag">Mental Health · College Edition</div>
    <div className="a-title">Welcome back</div><div className="a-sub">Sign in to continue</div>
    <div className="fg"><label className="fl">Email</label>
      <div className="ig"><span className="ig-i">✉️</span>
        <input className="fi igl" type="email" placeholder="you@college.edu" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
      </div>
    </div>
    <div className="fg"><label className="fl">Password</label>
      <div className="ig"><span className="ig-i">🔒</span>
        <input className="fi igl" type={show?"text":"password"} placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
        <span className="ig-r" onClick={()=>setShow(v=>!v)}>{show?"🙈":"👁️"}</span>
      </div>
    </div>
    {err&&<div className="err mb3">⚠️ {err}</div>}
    <button className="btn btn-g" style={{width:"100%",padding:"11px",marginBottom:14}} onClick={submit} disabled={ld}>{ld?"Signing in...":"Sign In →"}</button>
    <div className="a-foot">Don't have an account? <span className="a-link" onClick={onReg}>Register here</span></div>
  </div></div>);
}

function RegisterPage({onDone,onLogin}){
  const[role,setRole]=useState("student");
  const[f,setF]=useState({name:"",email:"",college:"",phone:"",pass:"",confirm:""});
  const[err,setErr]=useState("");const[done,setDone]=useState(false);const[ld,setLd]=useState(false);
  const up=(k,v)=>setF(p=>({...p,[k]:v}));
  const str=p=>{let s=0;if(p.length>=8)s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^a-zA-Z0-9]/.test(p))s++;return s;};
  const sc=str(f.pass);const scol=["var(--brd)","var(--red)","var(--warn)","var(--pur)","var(--acc)"];
  const submit=async()=>{
    setErr("");
    if(!f.name.trim()||!f.email.trim()||!f.pass||!f.confirm){setErr("All required fields must be filled.");return;}
    if(!/\S+@\S+\.\S+/.test(f.email)){setErr("Enter a valid email.");return;}
    if(f.pass!==f.confirm){setErr("Passwords do not match.");return;}
    if(f.pass.length<8){setErr("Password must be at least 8 characters.");return;}
    setLd(true);
    try{
      const existing=await FB.getUser(f.email.toLowerCase().trim());
      if(existing){setErr("Email already registered. Please login.");setLd(false);return;}
      await FB.saveUser(f.email.toLowerCase().trim(),{name:f.name.trim(),email:f.email.toLowerCase().trim(),pass:f.pass,role,college:f.college.trim(),phone:f.phone.trim(),registeredAt:new Date().toISOString()});
      setDone(true);
    }catch{setErr("Connection error. Check internet and Firebase setup.");}
    setLd(false);
  };
  if(done)return(<div className="auth-pg"><div className="auth-box" style={{textAlign:"center"}}>
    <div style={{fontSize:"3rem",marginBottom:12}}>🎉</div>
    <div className="a-logo">🌿 Mind Mitra</div>
    <div style={{fontFamily:"var(--serif)",fontSize:"1.4rem",margin:"16px 0 8px"}}>Account Created!</div>
    <div style={{color:"var(--mut)",fontSize:".82rem",marginBottom:20}}>Welcome, <strong style={{color:"var(--txt)"}}>{f.name}</strong> · {role==="student"?"🎓 Student":"🩺 Counselor"}</div>
    <button className="btn btn-g" style={{width:"100%",padding:"11px"}} onClick={onDone}>Go to Login →</button>
  </div></div>);
  return(<div className="auth-pg"><div className="auth-box">
    <div className="a-logo">🌿 Mind Mitra</div>
    <div className="a-tag">Mental Health · College Edition</div>
    <div className="a-title">Create account</div><div className="a-sub">Join Mind Mitra — it's free</div>
    <div className="fg"><label className="fl">I am a</label>
      <div className="rc">
        {[{v:"student",i:"🎓",l:"Student",d:"Track my mental health"},{v:"counselor",i:"🩺",l:"Counselor",d:"Support students"}].map(r=>(
          <div key={r.v} className={`rc-card ${role===r.v?"s":""}`} onClick={()=>setRole(r.v)}>
            <div style={{fontSize:"1.5rem",marginBottom:5}}>{r.i}</div>
            <div style={{fontWeight:600,fontSize:".8rem"}}>{r.l}</div>
            <div style={{fontSize:".67rem",color:"var(--mut)",marginTop:2}}>{r.d}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="frow">
      <div className="fg"><label className="fl">Full Name *</label><input className="fi" placeholder="Your full name" value={f.name} onChange={e=>up("name",e.target.value)}/></div>
      <div className="fg"><label className="fl">Phone</label><input className="fi" placeholder="98XXXXXXXX" value={f.phone} onChange={e=>up("phone",e.target.value)}/></div>
    </div>
    <div className="fg"><label className="fl">Email *</label><input className="fi" type="email" placeholder="you@college.edu" value={f.email} onChange={e=>up("email",e.target.value)}/></div>
    <div className="fg"><label className="fl">College</label><input className="fi" placeholder="e.g. MIT Pune, SPPU..." value={f.college} onChange={e=>up("college",e.target.value)}/></div>
    <div className="frow">
      <div className="fg"><label className="fl">Password *</label>
        <input className="fi" type="password" placeholder="Min 8 chars" value={f.pass} onChange={e=>up("pass",e.target.value)}/>
        {f.pass&&<div className="sb">{[1,2,3,4].map(i=><div key={i} className="ss" style={{background:i<=sc?scol[sc]:"var(--brd)"}}/>)}</div>}
      </div>
      <div className="fg"><label className="fl">Confirm *</label>
        <input className="fi" type="password" placeholder="Repeat" value={f.confirm} onChange={e=>up("confirm",e.target.value)}/>
        {f.confirm&&f.confirm!==f.pass&&<div className="err">Doesn't match</div>}
      </div>
    </div>
    {err&&<div className="err mb3">⚠️ {err}</div>}
    <button className="btn btn-g" style={{width:"100%",padding:"11px",marginBottom:14}} onClick={submit} disabled={ld}>{ld?"Creating account...":"Create Account →"}</button>
    <div className="a-foot">Already have an account? <span className="a-link" onClick={onLogin}>Sign in</span></div>
  </div></div>);
}

function BookModal({user,peers,forCounselor,sendMessage,onBook,onClose}){
  const[type,setType]=useState("video");const[date,setDate]=useState("");const[time,setTime]=useState("");
  const[peerEmail,setPeer]=useState(peers[0]?.email||"");const[notes,setNotes]=useState("");const[err,setErr]=useState("");const[ld,setLd]=useState(false);
  const fees={video:799,phone:499,person:999};
  const submit=async()=>{
    if(!date){setErr("Please select a date.");return;}
    if(!time){setErr("Please select a time.");return;}
    if(!peerEmail){setErr(`No ${forCounselor?"student":"counselor"} available.`);return;}
    setLd(true);
    const peer=peers.find(p=>p.email===peerEmail);
    const s={student:forCounselor?(peer?.name||"Student"):user.name,studentEmail:forCounselor?peerEmail:user.email,counselor:forCounselor?user.name:(peer?.name||"Counselor"),counselorEmail:forCounselor?user.email:peerEmail,type,date,time,status:"upcoming",notes,paid:false,fee:fees[type]};
    await onBook(s);
    await sendMessage(peerEmail,"📅 New Session Booked",`A ${type==="video"?"Video Call":type==="phone"?"Phone Call":"In-Person"} session has been booked for ${date} at ${time}.`,"booking");
    setLd(false);
  };
  return(<>
    <div className="m-t">Book a Session</div><div className="m-s">Schedule a therapy appointment</div>
    {peers.length===0&&<div className="al-w"><span>⚠️</span><div style={{fontSize:".8rem",color:"var(--warn)"}}>No {forCounselor?"students":"counselors"} registered yet.</div></div>}
    <div className="fg"><label className="fl">Session Type</label>
      <div className="mg">
        {[{v:"video",e:"📹",l:"Video"},{v:"phone",e:"📞",l:"Phone"},{v:"person",e:"🏫",l:"In-Person"}].map(t=>(
          <button key={t.v} className={`mb2 ${type===t.v?"s":""}`} onClick={()=>setType(t.v)}>{t.e} {t.l} <span style={{fontSize:".7rem",color:"var(--mut)"}}>₹{fees[t.v]}</span></button>
        ))}
      </div>
    </div>
    {peers.length>0&&<div className="fg"><label className="fl">{forCounselor?"Select Student":"Select Counselor"}</label>
      <select className="fi" value={peerEmail} onChange={e=>setPeer(e.target.value)} style={{appearance:"none"}}>
        {peers.map(p=><option key={p.email} value={p.email}>{p.name}{p.college?` · ${p.college}`:""}</option>)}
      </select>
    </div>}
    <div className="frow">
      <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={e=>setDate(e.target.value)}/></div>
      <div className="fg"><label className="fl">Time</label><input className="fi" type="time" value={time} onChange={e=>setTime(e.target.value)}/></div>
    </div>
    <div className="fg"><label className="fl">Notes (optional)</label><textarea className="fi fta" placeholder="Topics to discuss..." value={notes} onChange={e=>setNotes(e.target.value)}/></div>
    {err&&<div className="err mb3">⚠️ {err}</div>}
    <div style={{display:"flex",gap:10}}>
      <button className="btn btn-g" style={{flex:1}} onClick={submit} disabled={ld||peers.length===0}>{ld?"Booking...":"Confirm Booking"}</button>
      <button className="btn btn-o" onClick={onClose}>Cancel</button>
    </div>
  </>);
}

function RescheduleModal({session,user,onReschedule,onCancel,onClose}){
  const[mode,setMode]=useState("reschedule");
  const[date,setDate]=useState(session.date||"");const[time,setTime]=useState(session.time||"");
  const[reason,setReason]=useState("");
  return(<>
    <div className="m-t">{mode==="reschedule"?"Reschedule":"Cancel"} Session</div>
    <div className="m-s">{session.date} · {session.time}</div>
    <div className="tabs" style={{marginBottom:16}}>
      <button className={`tab ${mode==="reschedule"?"act":""}`} onClick={()=>setMode("reschedule")}>📅 Reschedule</button>
      <button className={`tab ${mode==="cancel"?"act":""}`} onClick={()=>setMode("cancel")}>❌ Cancel</button>
    </div>
    {mode==="reschedule"&&<div className="frow">
      <div className="fg"><label className="fl">New Date</label><input className="fi" type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={e=>setDate(e.target.value)}/></div>
      <div className="fg"><label className="fl">New Time</label><input className="fi" type="time" value={time} onChange={e=>setTime(e.target.value)}/></div>
    </div>}
    <div className="fg"><label className="fl">Reason</label><textarea className="fi fta" placeholder="e.g. Schedule conflict..." value={reason} onChange={e=>setReason(e.target.value)}/></div>
    <div style={{background:"var(--surf2)",borderRadius:10,padding:"9px 12px",marginBottom:14,fontSize:".74rem",color:"var(--mut)"}}>📬 Both parties will receive a notification.</div>
    <div style={{display:"flex",gap:10}}>
      {mode==="reschedule"
        ?<button className="btn btn-g" style={{flex:1}} onClick={()=>onReschedule({...session,date,time},reason)}>Confirm Reschedule</button>
        :<button className="btn btn-r" style={{flex:1}} onClick={()=>onCancel(session,reason)}>Confirm Cancellation</button>}
      <button className="btn btn-o" onClick={onClose}>Back</button>
    </div>
  </>);
}

function NoteForm({onSave,onClose}){
  const[t,setT]=useState("");
  return(<>
    <div className="fg"><label className="fl">Session Notes</label>
      <textarea className="fi fta" style={{minHeight:120}} placeholder="Observations, follow-ups, recommendations..." value={t} onChange={e=>setT(e.target.value)}/>
    </div>
    <div style={{display:"flex",gap:10}}>
      <button className="btn btn-g" style={{flex:1}} onClick={()=>{if(t.trim())onSave(t);}}>Save Notes</button>
      <button className="btn btn-o" onClick={onClose}>Cancel</button>
    </div>
  </>);
}

function SessionRoom({session,user,onClose}){
  const tl={video:"Video Call",phone:"Phone Call",person:"In-Person"};
  const other=user.role==="student"?session.counselor:session.student;
  const otherEmail=user.role==="student"?session.counselorEmail:session.studentEmail;
  const chatId=[user.email,otherEmail].sort().join("__");
  const[msgs,setMsgs]=useState([]);
  const[inp,setInp]=useState("");
  const[callStarted,setCallStarted]=useState(false);

  // Room name is shared — same for both student and counselor
  // Uses 100ms.live embed — no login, no moderator, completely free
  const roomName=`mindmitra-${session.id}`.replace(/[^a-z0-9-]/gi,"-").toLowerCase();
  // 100ms room embed URL — no account needed to JOIN
  const callUrl=`https://mindmitra-app.app.100ms.live/meeting/${roomName}`;

  // Fallback: Google Meet style link using whereby.com (free, no login needed)
  const wherebyUrl=`https://whereby.com/mindmitra-${roomName}`;

  useEffect(()=>{
    const q=query(collection(db,"chats",chatId,"messages"),orderBy("createdAt","asc"));
    const unsub=onSnapshot(q,snap=>{
      setMsgs(snap.docs.map(d=>({...d.data(),id:d.id})));
      setTimeout(()=>{const el=document.getElementById("sr-bot");if(el)el.scrollIntoView({behavior:"smooth"});},50);
    });
    return()=>unsub();
  },[chatId]);

  const send=async()=>{
    if(!inp.trim())return;
    await FB.sendChat(chatId,{from:user.email,fromName:user.name,text:inp.trim(),ts:new Date().toLocaleTimeString()});
    setInp("");
  };

  return(<>
    <div className="m-t">Session Room</div>
    <div className="m-s">{tl[session.type]} · {session.date} at {session.time} · with {other}</div>

    {session.type==="video"&&<>
      {/* Video call embedded directly in the app */}
      {callStarted?(
        <div style={{marginBottom:16}}>
          <div style={{background:"var(--surf2)",borderRadius:12,overflow:"hidden",border:"1px solid var(--brd)",marginBottom:10}}>
            <iframe
              src={`https://meet.google.com/new`}
              allow="camera; microphone; fullscreen; display-capture"
              style={{width:"100%",height:480,border:"none",borderRadius:12}}
              title="Video Call"
            />
          </div>
          <div style={{fontSize:".72rem",color:"var(--mut)",textAlign:"center",marginBottom:8}}>
            If the above doesn't load, use one of the direct links below:
          </div>
          <div style={{display:"flex",gap:8}}>
            <a href={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&userInfo.displayName=${encodeURIComponent(user.name)}`}
              target="_blank" rel="noreferrer"
              style={{flex:1,padding:"10px",borderRadius:10,background:"rgba(88,196,160,.12)",border:"1px solid var(--acc)",color:"var(--acc)",textAlign:"center",fontSize:".78rem",fontWeight:600,textDecoration:"none",display:"block"}}>
              📹 Open in Jitsi (No Login)
            </a>
            <a href={`https://whereby.com/mindmitra-${roomName}`}
              target="_blank" rel="noreferrer"
              style={{flex:1,padding:"10px",borderRadius:10,background:"rgba(123,104,238,.12)",border:"1px solid var(--pur)",color:"var(--pur)",textAlign:"center",fontSize:".78rem",fontWeight:600,textDecoration:"none",display:"block"}}>
              📹 Open in Whereby (No Login)
            </a>
          </div>
        </div>
      ):(
        <div className="room-banner">
          <div style={{fontSize:"2.5rem",marginBottom:10}}>📹</div>
          <div style={{fontWeight:700,fontSize:"1rem",marginBottom:6}}>Video Call with {other}</div>
          <div style={{fontSize:".78rem",color:"var(--mut)",marginBottom:18,lineHeight:1.6}}>
            Click the button below to start the video call.<br/>
            <strong style={{color:"var(--acc)"}}>No login or account needed</strong> — just click and join!
          </div>

          {/* PRIMARY — Jitsi with auto-join config (skips moderator screen) */}
          <a
            href={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&userInfo.displayName=${encodeURIComponent(user.name)}`}
            target="_blank"
            rel="noreferrer"
            style={{display:"block",marginBottom:12}}
          >
            <button className="join-btn" style={{width:"100%",fontSize:".9rem",padding:"14px"}}>
              📹 Join Video Call — No Login Needed
            </button>
          </a>

          <div style={{fontSize:".72rem",color:"var(--mut)",marginBottom:12}}>
            — or use a backup option —
          </div>

          {/* BACKUP — Whereby (completely login-free) */}
          <a
            href={`https://whereby.com/mindmitra-${roomName}`}
            target="_blank"
            rel="noreferrer"
            style={{display:"block"}}
          >
            <button style={{width:"100%",padding:"11px 20px",borderRadius:10,border:"1.5px solid var(--pur)",background:"rgba(123,104,238,.1)",color:"var(--pur)",fontFamily:"var(--font)",fontSize:".82rem",fontWeight:600,cursor:"pointer"}}>
              🔗 Backup: Open in Whereby (No Login)
            </button>
          </a>

          <div style={{marginTop:16,background:"rgba(0,0,0,.2)",borderRadius:8,padding:"10px 14px",fontSize:".7rem",color:"var(--mut)",textAlign:"left"}}>
            <div style={{fontWeight:600,marginBottom:4,color:"var(--txt)"}}>📋 Instructions:</div>
            <div>1. Both student and counselor click the same button above</div>
            <div>2. Allow camera and microphone when asked</div>
            <div>3. You will be in the same room automatically</div>
            <div style={{marginTop:6,color:"var(--acc)"}}>Room ID: {roomName}</div>
          </div>
        </div>
      )}
    </>}

    {session.type==="phone"&&<div className="room-banner">
      <div style={{fontSize:"2rem",marginBottom:8}}>📞</div>
      <div style={{fontWeight:700,fontSize:"1rem",marginBottom:12}}>Phone Call with {other}</div>
      <div style={{fontSize:".8rem",color:"var(--mut)",marginBottom:16}}>
        Call your {user.role==="student"?"counselor":"student"} directly on their registered number.
      </div>
      <button className="join-btn" style={{width:"100%"}} onClick={async()=>{
        const u=await FB.getUser(otherEmail);
        if(u?.phone) window.open(`tel:${u.phone}`,"_self");
        else alert("Phone number not available in their profile. Please use the chat below to coordinate.");
      }}>📞 Call Now</button>
    </div>}

    {session.type==="person"&&<div className="room-banner">
      <div style={{fontSize:"2rem",marginBottom:8}}>🏫</div>
      <div style={{fontWeight:700,fontSize:"1rem",marginBottom:8}}>In-Person Session</div>
      <div style={{fontSize:".82rem",color:"var(--mut)",lineHeight:1.7}}>
        Please go to the counselor's office at the scheduled time.<br/>
        Use the chat below to communicate before your session.
      </div>
    </div>}

    {/* In-app chat — always visible */}
    <div style={{fontWeight:600,fontSize:".82rem",marginBottom:8}}>💬 Session Chat</div>
    <div className="chat-wrap">
      <div className="chat-msgs">
        {msgs.length===0&&<div style={{textAlign:"center",color:"var(--mut)",fontSize:".77rem",padding:"20px"}}>No messages yet. Say hello! 👋</div>}
        {msgs.map(m=>(
          <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:m.from===user.email?"flex-end":"flex-start"}}>
            <div className={`chat-bubble ${m.from===user.email?"me":"them"}`}>{m.text}</div>
            <div style={{fontSize:".63rem",color:"var(--mut)",marginTop:2,padding:"0 4px"}}>{m.fromName} · {m.ts}</div>
          </div>
        ))}
        <div id="sr-bot"/>
      </div>
      <div className="chat-input-row">
        <input className="fi" placeholder="Type a message..." value={inp} onChange={e=>setInp(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          style={{flex:1,padding:"8px 12px"}}/>
        <button className="btn btn-g btn-sm" onClick={send}>Send</button>
      </div>
    </div>
    <button className="btn btn-o" style={{width:"100%",marginTop:14}} onClick={onClose}>Close Room</button>
  </>);
}

function ChatPage({user,peers}){
  const[selEmail,setSelEmail]=useState(peers[0]?.email||"");
  const[msgs,setMsgs]=useState([]);const[inp,setInp]=useState("");
  const chatId=selEmail?[user.email,selEmail].sort().join("__"):null;
  useEffect(()=>{
    if(!chatId)return;
    const q=query(collection(db,"chats",chatId,"messages"),orderBy("createdAt","asc"));
    const unsub=onSnapshot(q,snap=>{
      setMsgs(snap.docs.map(d=>({...d.data(),id:d.id})));
      setTimeout(()=>{const el=document.getElementById("cp-bot");if(el)el.scrollIntoView({behavior:"smooth"});},50);
    });
    return()=>unsub();
  },[chatId]);
  const send=async()=>{if(!inp.trim()||!chatId)return;await FB.sendChat(chatId,{from:user.email,fromName:user.name,text:inp.trim(),ts:new Date().toLocaleTimeString()});setInp("");};
  const selPeer=peers.find(p=>p.email===selEmail);
  return(<>
    <div className="pt">Messages & Chat</div>
    <div className="ps">Real-time chat — works across all devices 🌐</div>
    {peers.length===0?<div className="card"><div className="empty"><div className="ei">💬</div>No {user.role==="student"?"counselors":"students"} registered yet.</div></div>
    :<div style={{display:"flex",gap:16,height:"70vh"}}>
      <div style={{width:200,flexShrink:0,display:"flex",flexDirection:"column",gap:7}}>
        <div style={{fontSize:".7rem",color:"var(--mut)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>{user.role==="student"?"Counselors":"Students"}</div>
        {peers.map(p=>(
          <div key={p.email} style={{padding:"10px 12px",borderRadius:12,cursor:"pointer",border:`1.5px solid ${selEmail===p.email?"var(--acc)":"var(--brd)"}`,background:selEmail===p.email?"rgba(88,196,160,.07)":"var(--surf2)",transition:"all .2s"}} onClick={()=>setSelEmail(p.email)}>
            <div style={{fontWeight:600,fontSize:".82rem"}}>{p.name}</div>
            {p.college&&<div style={{fontSize:".67rem",color:"var(--mut)"}}>{p.college}</div>}
          </div>
        ))}
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        {selPeer&&<div style={{padding:"10px 14px",background:"var(--surf2)",borderRadius:"12px 12px 0 0",border:"1px solid var(--brd)",borderBottom:"none",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"var(--surf)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".95rem"}}>{user.role==="student"?"🩺":"🎓"}</div>
          <div><div style={{fontWeight:600,fontSize:".85rem"}}>{selPeer.name}</div><div style={{fontSize:".67rem",color:"var(--acc)"}}>● Connected</div></div>
        </div>}
        <div className="chat-wrap" style={{borderRadius:selPeer?"0 0 12px 12px":"12px",flex:1}}>
          <div className="chat-msgs" style={{height:"auto",flex:1}}>
            {msgs.length===0&&<div style={{textAlign:"center",color:"var(--mut)",fontSize:".77rem",padding:"24px 0"}}>No messages yet. Start the conversation! 👋</div>}
            {msgs.map(m=>(
              <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:m.from===user.email?"flex-end":"flex-start"}}>
                <div className={`chat-bubble ${m.from===user.email?"me":"them"}`}>{m.text}</div>
                <div style={{fontSize:".63rem",color:"var(--mut)",marginTop:2,padding:"0 4px"}}>{m.fromName} · {m.ts}</div>
              </div>
            ))}
            <div id="cp-bot"/>
          </div>
          <div className="chat-input-row">
            <input className="fi" placeholder={`Message ${selPeer?.name||""}...`} value={inp} onChange={e=>setInp(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} style={{flex:1,padding:"8px 12px"}}/>
            <button className="btn btn-g btn-sm" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>}
  </>);
}

function StudentDash({user,sessions,checkins,xp,level,unlockedBadges,setPage,setShowRoom}){
  const upcoming=sessions.filter(s=>s.status==="upcoming");
  const pendingAmt=sessions.filter(s=>!s.paid&&s.status==="upcoming").reduce((a,s)=>a+s.fee,0);
  const todayCI=checkins.find(c=>c.date===new Date().toLocaleDateString());
  const avgScore=checkins.length?Math.round(checkins.reduce((a,c)=>a+c.score,0)/checkins.length):0;
  const hr=new Date().getHours();const greet=hr<12?"Good Morning":hr<17?"Good Afternoon":"Good Evening";
  return(<>
    <div className="pt">{greet}, {user.name.split(" ")[0]} 👋</div>
    <div className="ps">{new Date().toDateString()} · {user.college||"Mind Mitra"}</div>
    {pendingAmt>0&&<div className="al-w"><span>💳</span><div><div style={{fontSize:".82rem",fontWeight:600,color:"var(--warn)"}}>₹{pendingAmt} payment pending</div><div style={{fontSize:".74rem",color:"var(--mut)"}}><span style={{color:"var(--acc)",cursor:"pointer"}} onClick={()=>setPage("payments")}>Pay now →</span></div></div></div>}
    {upcoming.length>0&&<div className="al-g"><span>🔔</span><div><div style={{fontSize:".82rem",fontWeight:600,color:"var(--acc)"}}>Upcoming: {upcoming[0].type==="video"?"Video Call":upcoming[0].type==="phone"?"Phone Call":"In-Person"} with {upcoming[0].counselor}</div><div style={{fontSize:".73rem",color:"var(--mut)"}}>{upcoming[0].date} at {upcoming[0].time} <span style={{color:"var(--pur)",cursor:"pointer",marginLeft:8}} onClick={()=>setShowRoom(upcoming[0])}>→ Join Room</span></div></div></div>}
    <div className="g4 mb4">
      {[{l:"Check-Ins",v:String(checkins.length),u:"total",c:"var(--acc)",i:"🔥"},{l:"Avg Score",v:avgScore?`${avgScore}`:"-",u:"/100",c:"var(--pur)",i:"💜"},{l:"Sessions",v:String(upcoming.length),u:"upcoming",c:"var(--pnk)",i:"📅"},{l:"XP · Level",v:`${xp}`,u:`Lv${level}`,c:"var(--warn)",i:"⚡"}].map(s=>(
        <div className="sc" key={s.l}><div style={{fontSize:"1.3rem",marginBottom:5}}>{s.i}</div><div style={{fontSize:"1.5rem",fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:".71rem",color:"var(--mut)",marginTop:5}}>{s.l} {s.u}</div></div>
      ))}
    </div>
    <div className="g2">
      <div className="card"><div className="ct">Mood Trend</div>
        {checkins.length===0?<div className="empty"><div className="ei">📊</div>No check-ins yet</div>:<>
          <div className="chart">{checkins.slice(-7).map((c,i)=><div key={i} className={`bar ${c.score<30?"dr":c.score<55?"wr":""}`} style={{height:`${c.score}%`}}/>)}</div>
          <div className="clb">{checkins.slice(-7).map((c,i)=><div key={i} className="cl">{c.day||"—"}</div>)}</div>
        </>}
      </div>
      <div className="card"><div className="ct">Quick Actions</div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginTop:4}}>
          <button className="btn btn-g" onClick={()=>setPage("checkin")} style={{width:"100%",padding:"11px"}}>{todayCI?"✏️ Update Check-In":"💚 Do Today's Check-In"}</button>
          <button className="btn btn-o" onClick={()=>setPage("sessions")} style={{width:"100%",padding:"11px"}}>📅 Book a Session</button>
          {pendingAmt>0&&<button className="btn btn-p" onClick={()=>setPage("payments")} style={{width:"100%",padding:"11px"}}>💳 Pay ₹{pendingAmt}</button>}
          <button className="btn btn-o" onClick={()=>setPage("rewards")} style={{width:"100%",padding:"11px"}}>🏆 Rewards ({unlockedBadges.length}/{BADGES.length})</button>
          <button className="btn btn-o" onClick={()=>setPage("games")} style={{width:"100%",padding:"11px"}}>🎮 Stress Relief Games</button>
        </div>
      </div>
    </div>
  </>);
}

function CheckInPage({user,checkins,notify,badgeData,setBadgeData}){
  const todayKey=new Date().toLocaleDateString();
  const todayCI=checkins.find(c=>c.date===todayKey);
  const[selMood,setSM]=useState(todayCI?MOODS.find(m=>m.l===todayCI.mood)||null:null);
  const[stress,setStress]=useState(todayCI?.stress||50);
  const[journal,setJournal]=useState(todayCI?.journal||"");
  const[done,setDone]=useState(false);
  const submit=async()=>{
    const score=selMood?selMood.s:(100-stress);
    const entry={userEmail:user.email,date:todayKey,day:DAYS[new Date().getDay()],mood:selMood?.l||"Okay",emoji:selMood?.e||"😐",score,stress,journal,time:new Date().toLocaleTimeString()};
    await FB.saveCheckin(user.email,entry);
    setDone(true);
    if(stress>=80)notify("🚨 High Stress Alert","Your counselor has been notified.","red");
    else notify("✅ Check-In Saved","Your wellness data has been stored.");
  };
  if(done||todayCI){
    const ci=todayCI;
    return(<>
      <div className="pt">Daily Check-In</div><div className="ps">Your data is encrypted 🔒</div>
      <div className="card" style={{textAlign:"center",padding:"44px 24px",maxWidth:500}}>
        <div style={{fontSize:"3rem",marginBottom:12}}>{ci?.emoji||"✅"}</div>
        <div style={{fontFamily:"var(--serif)",fontSize:"1.4rem",marginBottom:8}}>Check-In Complete!</div>
        <div style={{color:"var(--mut)",fontSize:".8rem",marginBottom:20}}>{todayKey}</div>
        <div style={{background:"var(--surf2)",borderRadius:12,padding:"14px",marginBottom:20}}>
          <div style={{fontSize:".75rem",color:"var(--mut)",marginBottom:4}}>Wellness Score</div>
          <div style={{fontSize:"2.4rem",fontWeight:700,color:ci?.score<30?"var(--red)":ci?.score<55?"var(--warn)":"var(--acc)"}}>{ci?.score||100-stress}/100</div>
          <div style={{fontSize:".77rem",color:"var(--mut)",marginTop:4}}>Mood: {ci?.mood||selMood?.l||"—"} · Stress: {ci?.stress||stress}%</div>
        </div>
        <button className="btn btn-o" onClick={()=>setDone(false)}>✏️ Update Today's Check-In</button>
      </div>
    </>);
  }
  return(<>
    <div className="pt">Daily Check-In</div>
    <div className="ps">Your data is encrypted and private 🔒</div>
    {stress>=80&&<div className="al-r"><span>🚨</span><div><div style={{fontSize:".82rem",fontWeight:600,color:"var(--red)"}}>High Stress Detected</div><div style={{fontSize:".74rem",color:"var(--mut)"}}>Submitting will alert your counselor.</div></div></div>}
    <div style={{maxWidth:540}}>
      <div className="card mb3"><div className="ct">How are you feeling?</div>
        <div className="mg">{MOODS.map(m=><button key={m.l} className={`mb2 ${selMood?.l===m.l?"s":""}`} onClick={()=>{setSM(m);setStress(100-m.s);}}>{m.e} {m.l}</button>)}</div>
      </div>
      <div className="card mb3"><div className="ct">Stress Level</div>
        <div style={{marginTop:10}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:".68rem",color:"var(--mut)",marginBottom:6}}><span>Calm</span><span>Moderate</span><span>High</span></div>
          <input type="range" min="0" max="100" value={stress} onChange={e=>setStress(Number(e.target.value))}/>
          <div style={{textAlign:"center",marginTop:10,fontSize:"1.5rem",fontWeight:700,color:stress>=80?"var(--red)":stress>=55?"var(--warn)":"var(--acc)"}}>{stress}%</div>
        </div>
      </div>
      <div className="card mb3"><div className="ct">Journal — Private & Encrypted</div>
        <textarea className="fi fta" placeholder="How was your day? Write freely..." value={journal} onChange={e=>setJournal(e.target.value)}/>
      </div>
      <button className="btn btn-g" style={{width:"100%",padding:"12px"}} onClick={submit}>{todayCI?"Update Check-In":"Submit Check-In"}</button>
    </div>
  </>);
}

function MySessions({user,sessions,setShowBook,setShowPay,setShowResc,setShowRoom}){
  const icons={video:"📹",phone:"📞",person:"🏫"};const cls={video:"ic-v",phone:"ic-p",person:"ic-i"};const tl={video:"Video Call",phone:"Phone Call",person:"In-Person"};
  return(<>
    <div className="pt">My Sessions</div><div className="ps">Your therapy appointments</div>
    <div className="fb mb4">
      <span style={{fontSize:".8rem",color:"var(--mut)"}}>{sessions.filter(s=>s.status==="upcoming").length} upcoming</span>
      <button className="btn btn-g btn-sm" onClick={()=>setShowBook(true)}>+ Book Session</button>
    </div>
    {sessions.length===0?<div className="card"><div className="empty"><div className="ei">📅</div>No sessions yet.<br/><button className="btn btn-g mt3" onClick={()=>setShowBook(true)}>Book Your First Session</button></div></div>
    :sessions.map(s=>(
      <div key={s.id} className={`sr ${s.status==="cancelled"?"cancelled-row":""}`}>
        <div className={`sr-ic ${cls[s.type]||"ic-v"}`}>{icons[s.type]||"📅"}</div>
        <div className="sr-info">
          <div className="sr-t">{tl[s.type]} with {s.counselor}</div>
          <div className="sr-m">{s.date} · {s.time}</div>
          {s.cancelMsg&&<div style={{fontSize:".7rem",color:"var(--red)",marginTop:3}}>❌ {s.cancelMsg}</div>}
          <div style={{marginTop:5,display:"flex",gap:5,flexWrap:"wrap"}}>
            <span className={`bdg ${s.paid?"b-g":"b-w"}`}>{s.paid?"✅ Paid":`₹${s.fee} Due`}</span>
            <span className={`bdg ${s.status==="upcoming"?"b-g":s.status==="cancelled"?"b-r":"b-m"}`}>{s.status}</span>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
          {!s.paid&&s.status==="upcoming"&&<button className="btn btn-p btn-sm" onClick={()=>setShowPay(s)}>Pay ₹{s.fee}</button>}
          {s.status==="upcoming"&&s.paid&&<button className="join-btn" style={{fontSize:".72rem",padding:"6px 12px"}} onClick={()=>setShowRoom(s)}>🚀 Join</button>}
          {s.status==="upcoming"&&<button className="btn btn-o btn-sm" onClick={()=>setShowResc(s)}>Manage</button>}
        </div>
      </div>
    ))}
    {sessions.length>0&&<button className="btn btn-o" style={{width:"100%",padding:"10px",marginTop:8}} onClick={()=>setShowBook(true)}>+ Book Another Session</button>}
  </>);
}

function AllSessions({sessions,setShowNote,setShowResc,setShowRoom}){
  const icons={video:"📹",phone:"📞",person:"🏫"};const tl={video:"Video Call",phone:"Phone Call",person:"In-Person"};
  return(<>
    <div className="pt">All Sessions</div><div className="ps">Manage and document all therapy sessions</div>
    {sessions.length===0?<div className="card"><div className="empty"><div className="ei">📅</div>No sessions yet.</div></div>
    :sessions.map(s=>(
      <div key={s.id} className={`sr ${s.status==="cancelled"?"cancelled-row":""}`}>
        <div className={`sr-ic ic-${s.type==="video"?"v":s.type==="phone"?"p":"i"}`}>{icons[s.type]||"📅"}</div>
        <div className="sr-info">
          <div className="sr-t">{s.student}</div>
          <div className="sr-m">{tl[s.type]} · {s.date} · {s.time}</div>
          {s.cancelMsg&&<div style={{fontSize:".69rem",color:"var(--red)",marginTop:2}}>❌ {s.cancelMsg}</div>}
          <div style={{marginTop:5,display:"flex",gap:5,flexWrap:"wrap"}}>
            <span className={`bdg ${s.paid?"b-g":"b-w"}`}>{s.paid?"✅ Paid":`₹${s.fee||0} Pending`}</span>
            <span className={`bdg ${s.status==="upcoming"?"b-g":s.status==="cancelled"?"b-r":"b-m"}`}>{s.status}</span>
          </div>
        </div>
        {s.status==="upcoming"&&<div style={{display:"flex",flexDirection:"column",gap:5}}>
          <button className="join-btn" style={{fontSize:".72rem",padding:"6px 12px"}} onClick={()=>setShowRoom(s)}>🚀 Join</button>
          <button className="btn btn-o btn-sm" onClick={()=>setShowNote(s)}>+ Notes</button>
          <button className="btn btn-w btn-sm" onClick={()=>setShowResc(s)}>Manage</button>
        </div>}
      </div>
    ))}
  </>);
}

function StudentNotesPage({notes}){
  return(<>
    <div className="pt">My Session Notes</div>
    <div className="ps">Notes written by your counselor after each session 🔒</div>
    {notes.length===0?<div className="card"><div className="empty"><div className="ei">📋</div>No notes yet from your counselor.<br/><span style={{fontSize:".76rem"}}>Notes will appear here after each session.</span></div></div>
    :notes.map(n=>(
      <div className="note-card" key={n.id}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div><div style={{fontWeight:600,fontSize:".84rem"}}>📋 {n.session}</div><div style={{fontSize:".7rem",color:"var(--mut)"}}>By {n.counselor} · {n.date}</div></div>
          <span className="bdg b-p">From Counselor</span>
        </div>
        <div style={{fontSize:".8rem",color:"var(--mut)",lineHeight:1.7,borderTop:"1px solid var(--brd)",paddingTop:10}}>{n.text}</div>
      </div>
    ))}
  </>);
}

function NotesPage({notes}){
  return(<>
    <div className="pt">Session Notes</div><div className="ps">Secure, encrypted therapy notes 🔒</div>
    {notes.length===0?<div className="card"><div className="empty"><div className="ei">📝</div>No notes yet. Add notes from the Sessions page.</div></div>
    :notes.map(n=>(
      <div className="note-card" key={n.id}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
          <div><div style={{fontWeight:600,fontSize:".84rem"}}>{n.student}</div><div style={{fontSize:".7rem",color:"var(--mut)"}}>{n.session} · {n.date}</div></div>
          <span className="bdg b-m">Saved · Visible to student</span>
        </div>
        <div style={{fontSize:".8rem",color:"var(--mut)",lineHeight:1.6}}>{n.text}</div>
      </div>
    ))}
  </>);
}

function InboxPage({inbox}){
  const markRead=async id=>{await updateDoc(doc(db,"messages",id),{read:true});};
  const typeColor={booking:"var(--acc)",cancel:"var(--red)",reschedule:"var(--warn)",info:"var(--pur)"};
  const typeIcon={booking:"📅",cancel:"❌",reschedule:"🔄",info:"ℹ️"};
  return(<>
    <div className="pt">Notifications</div><div className="ps">System messages and session alerts</div>
    {inbox.length===0?<div className="card"><div className="empty"><div className="ei">📬</div>No notifications yet.</div></div>
    :inbox.map(m=>(
      <div key={m.id} className="card mb3" style={{borderLeft:`3px solid ${typeColor[m.type]||"var(--acc)"}`,opacity:m.read?0.75:1,cursor:"pointer"}} onClick={()=>markRead(m.id)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><span>{typeIcon[m.type]||"📬"}</span><span style={{fontWeight:600,fontSize:".86rem"}}>{m.subject}</span></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {!m.read&&<span className="bdg b-g" style={{fontSize:".6rem"}}>NEW</span>}
            <span style={{fontSize:".7rem",color:"var(--mut)"}}>{m.date}</span>
          </div>
        </div>
        <div style={{fontSize:".75rem",color:"var(--mut)",marginBottom:4}}>From: {m.fromName}</div>
        <div style={{fontSize:".8rem",lineHeight:1.6,whiteSpace:"pre-line"}}>{m.body}</div>
      </div>
    ))}
  </>);
}

function PayPage({user,sessions,txns,setShowPay,notify,role}){
  const[tab,setTab]=useState("overview");const[selPlan,setSel]=useState("standard");const[planActive,setPlan]=useState(null);const[showPP,setShowPP]=useState(false);
  const unpaid=sessions.filter(s=>!s.paid&&s.status==="upcoming"&&(role==="student"?s.studentEmail===user?.email:true));
  const total=txns.reduce((a,t)=>a+t.amount,0);
  if(role==="counselor")return(<>
    <div className="pt">Payment Overview</div><div className="ps">All student session fees</div>
    <div className="g3 mb4">{[{l:"Collected",v:`₹${sessions.filter(s=>s.paid).reduce((a,s)=>a+(s.fee||0),0)}`,i:"💰",c:"var(--acc)"},{l:"Pending",v:`₹${sessions.filter(s=>!s.paid&&s.status!=="cancelled").reduce((a,s)=>a+(s.fee||0),0)}`,i:"⏳",c:"var(--warn)"},{l:"Sessions",v:String(sessions.length),i:"📅",c:"var(--pur)"}].map(s=>(
      <div className="sc" key={s.l}><div style={{fontSize:"1.3rem",marginBottom:5}}>{s.i}</div><div style={{fontSize:"1.5rem",fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:".71rem",color:"var(--mut)",marginTop:5}}>{s.l}</div></div>
    ))}</div>
    <div className="card"><div className="ct">All Sessions</div>
      {sessions.length===0&&<div className="empty"><div className="ei">💳</div>No sessions yet.</div>}
      {sessions.map(s=>(
        <div className="txr" key={s.id}>
          <div style={{width:34,height:34,borderRadius:9,background:s.type==="video"?"rgba(123,104,238,.14)":s.type==="phone"?"rgba(88,196,160,.14)":"rgba(255,126,179,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".95rem",flexShrink:0}}>{s.type==="video"?"📹":s.type==="phone"?"📞":"🏫"}</div>
          <div style={{flex:1,paddingLeft:9}}><div style={{fontSize:".82rem",fontWeight:600}}>{s.student}</div><div style={{fontSize:".7rem",color:"var(--mut)"}}>{s.date}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontWeight:700,color:s.paid?"var(--acc)":"var(--warn)"}}>₹{s.fee}</div><span className={`bdg ${s.paid?"b-g":"b-w"}`}>{s.paid?"Paid":"Pending"}</span></div>
        </div>
      ))}
    </div>
  </>);
  return(<>
    <div className="pt">Payments & Plans</div><div className="ps">Manage your session fees and subscription</div>
    <div className="tabs">{[{id:"overview",l:"Overview"},{id:"plans",l:"Plans"},{id:"history",l:"History"}].map(t=>(
      <button key={t.id} className={`tab ${tab===t.id?"act":""}`} onClick={()=>setTab(t.id)}>{t.l}</button>
    ))}</div>
    {tab==="overview"&&<>
      <div className="g3 mb4">{[{l:"Total Paid",v:`₹${total}`,i:"✅",c:"var(--acc)"},{l:"Pending",v:`₹${unpaid.reduce((a,s)=>a+s.fee,0)}`,i:"⏳",c:"var(--warn)"},{l:"Active Plan",v:planActive||"None",i:"💎",c:"var(--pur)"}].map(s=>(
        <div className="sc" key={s.l}><div style={{fontSize:"1.3rem",marginBottom:5}}>{s.i}</div><div style={{fontSize:"1.4rem",fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:".71rem",color:"var(--mut)",marginTop:5}}>{s.l}</div></div>
      ))}</div>
      {unpaid.length>0?<div className="card mb4"><div className="ct">⚠️ Pending</div>
        {unpaid.map(s=>(
          <div className="sr" key={s.id} style={{marginBottom:7}}>
            <div className={`sr-ic ic-${s.type==="video"?"v":s.type==="phone"?"p":"i"}`}>{s.type==="video"?"📹":s.type==="phone"?"📞":"🏫"}</div>
            <div className="sr-info"><div className="sr-t">{s.type==="video"?"Video":s.type==="phone"?"Phone":"In-Person"} with {s.counselor}</div><div className="sr-m">{s.date}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontWeight:700,color:"var(--warn)",marginBottom:5}}>₹{s.fee}</div><button className="btn btn-p btn-sm" onClick={()=>setShowPay(s)}>Pay Now</button></div>
          </div>
        ))}
      </div>:<div className="al-g"><span>✅</span><div style={{fontSize:".82rem",color:"var(--acc)",fontWeight:600}}>All payments up to date!</div></div>}
    </>}
    {tab==="plans"&&<>
      <div className="g3 mb4">{PLANS.map(p=>(
        <div key={p.id} className={`pc ${selPlan===p.id?"s":""}`} onClick={()=>setSel(p.id)}>
          {p.pop&&<div className="pp">POPULAR</div>}
          <div style={{fontWeight:700,marginBottom:4}}>{p.n}</div>
          <div style={{fontSize:"1.4rem",fontWeight:700,color:"var(--pur)",marginBottom:4}}>₹{p.p}<span style={{fontSize:".7rem",color:"var(--mut)",fontWeight:400}}>/mo</span></div>
          <div style={{fontSize:".7rem",color:"var(--mut)"}}>{p.d}</div>
        </div>
      ))}</div>
      {planActive?<div className="al-g"><span>✅</span><div><div style={{fontWeight:600,color:"var(--acc)"}}>{planActive} Plan Active</div></div></div>
        :<button className="btn btn-p" style={{width:"100%",padding:"11px"}} onClick={()=>setShowPP(true)}>Subscribe — ₹{PLANS.find(p=>p.id===selPlan)?.p}/month</button>}
      {showPP&&<PayModal session={{fee:PLANS.find(p=>p.id===selPlan)?.p,type:"video",counselor:"Mind Mitra",date:new Date().toLocaleDateString(),time:"",id:"plan"+Date.now(),studentEmail:user?.email}} user={user} onClose={()=>setShowPP(false)} onSuccess={async s=>{
        const pl=PLANS.find(p=>p.id===selPlan);
        await FB.addTxn({userEmail:user?.email,desc:`💎 ${pl.n} Plan`,amount:pl.p,date:new Date().toLocaleDateString(),icon:"💎",bg:"rgba(123,104,238,.13)"});
        setPlan(pl.n);setShowPP(false);notify("🎉 Plan Activated!","Subscription is now active.");
      }}/>}
    </>}
    {tab==="history"&&<div className="card"><div className="ct">Transaction History</div>
      {txns.length===0&&<div className="empty"><div className="ei">🧾</div>No transactions yet.</div>}
      {txns.map((t,i)=>(
        <div className="txr" key={i}>
          <div style={{width:34,height:34,borderRadius:9,background:t.bg||"rgba(88,196,160,.13)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".95rem",flexShrink:0}}>{t.icon}</div>
          <div style={{flex:1,paddingLeft:9}}><div style={{fontSize:".82rem",fontWeight:600}}>{t.desc}</div><div style={{fontSize:".7rem",color:"var(--mut)"}}>{t.date}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontWeight:700,color:"var(--acc)"}}>₹{t.amount}</div><span className="bdg b-g">Paid</span></div>
        </div>
      ))}
    </div>}
  </>);
}

function PayModal({session,user,onClose,onSuccess}){
  const[method,setM]=useState("card");const[step,setStep]=useState("d");
  const[card,setC]=useState({number:"",expiry:"",cvv:"",name:""});const[upi,setU]=useState("");const[err,setE]=useState("");
  const fc=v=>v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19);
  const fe=v=>{const d=v.replace(/\D/g,"").slice(0,4);return d.length>2?d.slice(0,2)+"/"+d.slice(2):d;};
  const pay=()=>{
    setE("");
    if(method==="card"){if(card.number.replace(/\s/g,"").length<16){setE("Enter a valid 16-digit card number.");return;}if(card.expiry.length<5){setE("Enter expiry MM/YY.");return;}if(card.cvv.length<3){setE("Enter a valid CVV.");return;}if(!card.name.trim()){setE("Enter cardholder name.");return;}}
    if(method==="upi"&&!upi.includes("@")){setE("Enter a valid UPI ID.");return;}
    setStep("p");setTimeout(()=>setStep("s"),2000);
  };
  const tl={video:"Video Call",phone:"Phone Call",person:"In-Person"};
  if(step==="p")return<div className="ov" onClick={onClose}><div className="modal" style={{textAlign:"center",padding:"40px"}} onClick={e=>e.stopPropagation()}><div style={{fontSize:"2.4rem",marginBottom:14,display:"inline-block",animation:"spin 1s linear infinite"}}>⏳</div><div style={{fontFamily:"var(--serif)",fontSize:"1.3rem"}}>Processing...</div></div></div>;
  if(step==="s")return<div className="ov" onClick={()=>onSuccess(session)}><div className="modal" style={{textAlign:"center",padding:"32px"}} onClick={e=>e.stopPropagation()}>
    <div style={{width:76,height:76,borderRadius:"50%",background:"rgba(88,196,160,.14)",border:"2px solid var(--acc)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.9rem",margin:"0 auto 14px",animation:"pop .4s ease"}}>✅</div>
    <div style={{fontFamily:"var(--serif)",fontSize:"1.35rem",marginBottom:7}}>Payment Successful!</div>
    <div style={{color:"var(--mut)",fontSize:".8rem",marginBottom:20}}>₹{session.fee} paid · Session confirmed 🎉</div>
    <button className="btn btn-g" style={{width:"100%"}} onClick={()=>onSuccess(session)}>Done</button>
  </div></div>;
  return<div className="ov" onClick={onClose}><div className="modal" style={{maxWidth:480}} onClick={e=>e.stopPropagation()}>
    <div className="m-t">Complete Payment</div><div className="m-s">{tl[session.type]||"Subscription"}</div>
    <div style={{background:"var(--surf2)",borderRadius:11,padding:"12px 15px",marginBottom:16}}>
      <div className="fb"><span style={{fontSize:".8rem",color:"var(--mut)"}}>Amount Due</span><span style={{fontSize:"1.3rem",fontWeight:700,color:"var(--pur)"}}>₹{session.fee}</span></div>
      <div style={{fontSize:".68rem",color:"var(--mut)",marginTop:3}}>🔐 Secure · Encrypted · Instant confirmation</div>
    </div>
    <div className="fg"><label className="fl">Payment Method</label>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[{v:"card",i:"💳",l:"Card"},{v:"upi",i:"📱",l:"UPI"},{v:"netbank",i:"🏦",l:"Net Banking"}].map(m=>(
          <div key={m.v} className={`pm ${method===m.v?"act":""}`} onClick={()=>setM(m.v)}><span className="pm-i">{m.i}</span>{m.l}</div>
        ))}
      </div>
    </div>
    {method==="card"&&<>
      <div className="fg"><label className="fl">Card Number</label>
        <div style={{position:"relative"}}><input className="fi" placeholder="1234 5678 9012 3456" value={card.number} onChange={e=>setC(c=>({...c,number:fc(e.target.value)}))}/>
          <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)"}}>{card.number.startsWith("4")?"💙":card.number.startsWith("5")?"❤️":"💳"}</span>
        </div>
      </div>
      <div className="frow">
        <div className="fg"><label className="fl">Expiry</label><input className="fi" placeholder="MM/YY" value={card.expiry} onChange={e=>setC(c=>({...c,expiry:fe(e.target.value)}))}/></div>
        <div className="fg"><label className="fl">CVV</label><input className="fi" placeholder="•••" maxLength={4} type="password" value={card.cvv} onChange={e=>setC(c=>({...c,cvv:e.target.value.replace(/\D/g,"")}))} /></div>
      </div>
      <div className="fg"><label className="fl">Cardholder Name</label><input className="fi" placeholder="Name as on card" value={card.name} onChange={e=>setC(c=>({...c,name:e.target.value}))}/></div>
    </>}
    {method==="upi"&&<div className="fg"><label className="fl">UPI ID</label>
      <input className="fi" placeholder="yourname@gpay / @paytm" value={upi} onChange={e=>setU(e.target.value)}/>
      <div style={{display:"flex",gap:7,marginTop:7,flexWrap:"wrap"}}>
        {["@paytm","@gpay","@phonepe","@ybl"].map(u=><span key={u} style={{padding:"3px 9px",background:"var(--surf2)",borderRadius:18,fontSize:".69rem",cursor:"pointer",color:"var(--mut)",border:"1px solid var(--brd)"}} onClick={()=>setU(v=>v.split("@")[0]+u)}>{u}</span>)}
      </div>
    </div>}
    {method==="netbank"&&<div className="fg"><label className="fl">Select Bank</label>
      <select className="fi" style={{appearance:"none"}}>{["SBI","HDFC Bank","ICICI Bank","Axis Bank","Kotak Bank","Punjab National Bank"].map(b=><option key={b}>{b}</option>)}</select>
    </div>}
    {err&&<div className="err mb3">⚠️ {err}</div>}
    <div style={{display:"flex",gap:9}}>
      <button className="btn btn-p" style={{flex:1,padding:"11px"}} onClick={pay}>🔒 Pay ₹{session.fee}</button>
      <button className="btn btn-o" onClick={onClose}>Cancel</button>
    </div>
    <div style={{textAlign:"center",marginTop:9,fontSize:".67rem",color:"var(--mut)"}}>🔐 256-bit SSL encrypted · PCI DSS compliant</div>
  </div></div>;
}

function HealthProfile({user,profile,setProfile,badgeData,setBadgeData,notify}){
  const[form,setForm]=useState(profile);
  const toggle=(arr,item)=>arr.includes(item)?arr.filter(x=>x!==item):[...arr,item];
  const save=async()=>{
    await FB.saveUser(user.email,{profile:form});setProfile(form);
    const done=form.triggers?.length>0&&form.coping?.length>0;
    setBadgeData(p=>({...p,profile_done:done}));
    await FB.saveUser(user.email,{badgeData:{profile_done:done}});
    notify("✅ Profile Saved","Your health profile has been updated securely.");
  };
  return(<>
    <div className="pt">Health Profile</div><div className="ps">Your mental health information — encrypted and private 🔒</div>
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="card"><div className="ct">My Triggers</div>
        <div style={{color:"var(--mut)",fontSize:".76rem",marginBottom:10}}>What situations worsen your mental health?</div>
        <div>{TRIGGERS.map(t=><span key={t} className={`health-tag ${form.triggers?.includes(t)?"sel":""}`} onClick={()=>setForm(f=>({...f,triggers:toggle(f.triggers||[],t)}))}>{t}</span>)}</div>
      </div>
      <div className="card"><div className="ct">My Coping Mechanisms</div>
        <div style={{color:"var(--mut)",fontSize:".76rem",marginBottom:10}}>What helps you feel better?</div>
        <div>{COPING.map(c=><span key={c} className={`health-tag ${form.coping?.includes(c)?"sel":""}`} onClick={()=>setForm(f=>({...f,coping:toggle(f.coping||[],c)}))}>{c}</span>)}</div>
      </div>
      <div className="card">
        <div className="ct">Mental Health History</div>
        <div className="fg"><label className="fl">Previous diagnoses (if any)</label><textarea className="fi fta" placeholder="e.g. Anxiety, Depression — or 'None'" value={form.history||""} onChange={e=>setForm(f=>({...f,history:e.target.value}))}/></div>
        <div className="fg"><label className="fl">Current medications (if any)</label><textarea className="fi fta" placeholder="List medications or write 'None'" value={form.medications||""} onChange={e=>setForm(f=>({...f,medications:e.target.value}))}/></div>
        <div className="fg"><label className="fl">Previous therapy experience</label><textarea className="fi fta" placeholder="e.g. CBT for 6 months — or 'First time'" value={form.therapyHistory||""} onChange={e=>setForm(f=>({...f,therapyHistory:e.target.value}))}/></div>
      </div>
      <button className="btn btn-g" style={{padding:"12px"}} onClick={save}>Save Health Profile</button>
    </div>
  </>);
}

function RewardsPage({xp,level,unlockedBadges}){
  const nextLevelXP=level*100;const currentXP=xp%100;
  return(<>
    <div className="pt">Rewards & Achievements</div><div className="ps">Earn XP by taking care of your mental health 🏆</div>
    <div className="card mb4">
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,var(--warn),var(--acc))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",flexShrink:0}}>⚡</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"var(--serif)",fontSize:"1.2rem"}}>Level {level}</div>
          <div style={{fontSize:".78rem",color:"var(--mut)",marginBottom:8}}>{xp} XP total · {nextLevelXP-currentXP} XP to next level</div>
          <div className="prog-bar"><div className="prog-fill" style={{width:`${Math.min(100,(currentXP/100)*100)}%`,background:"linear-gradient(90deg,var(--acc),var(--pur))"}}/></div>
        </div>
      </div>
    </div>
    <div className="g3">{BADGES.map(b=>{
      const unlocked=unlockedBadges.includes(b.id);
      return<div key={b.id} className={`rw-card ${unlocked?"unlocked":"locked"}`}>
        <div style={{fontSize:"2rem",marginBottom:8}}>{b.icon}</div>
        <div style={{fontWeight:600,fontSize:".84rem",marginBottom:4}}>{b.name}</div>
        <div style={{fontSize:".72rem",color:"var(--mut)",marginBottom:8}}>{b.desc}</div>
        <span className={`bdg ${unlocked?"b-g":"b-m"}`}>{unlocked?"✅ Unlocked":`+${b.xp} XP`}</span>
      </div>;
    })}</div>
  </>);
}

function GamesPage({activeGame,setActiveGame,user,badgeData,setBadgeData,notify}){
  const markBadge=async key=>{
    const updated={...badgeData,[key]:true};setBadgeData(updated);
    await FB.saveUser(user.email,{badgeData:{[key]:true}});
  };
  return(<>
    <div className="pt">Relax & Recharge</div><div className="ps">Science-backed stress relief 🌿</div>
    {!activeGame?<div className="g3">
      {[{id:"breath",i:"🫁",n:"Breathing Exercise",d:"4-7-8 guided breathing"},{id:"memory",i:"🧠",n:"Memory Match",d:"Calm focus card game"},{id:"gratitude",i:"🌸",n:"Gratitude Jar",d:"Write what you're grateful for"}].map(g=>(
        <div key={g.id} style={{background:"var(--surf)",border:"1px solid var(--brd)",borderRadius:"var(--r)",padding:20,cursor:"pointer",textAlign:"center",transition:"all .25s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--acc)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--brd)"}
          onClick={()=>setActiveGame(g.id)}>
          <div style={{fontSize:"2.4rem",marginBottom:10}}>{g.i}</div>
          <div style={{fontWeight:600,marginBottom:4}}>{g.n}</div>
          <div style={{fontSize:".73rem",color:"var(--mut)"}}>{g.d}</div>
        </div>
      ))}
    </div>
    :activeGame==="breath"?<BreathGame onBack={()=>setActiveGame(null)} onDone={()=>{markBadge("breath_played");notify("🫁 +60 XP!","Breathing exercise completed!");setActiveGame(null);}}/>
    :activeGame==="memory"?<MemGame onBack={()=>setActiveGame(null)}/>
    :<GratGame onBack={()=>setActiveGame(null)} onDone={()=>{markBadge("gratitude_played");notify("🌸 +60 XP!","Gratitude jar completed!");setActiveGame(null);}}/>}
  </>);
}

function BreathGame({onBack,onDone}){
  const[phase,setPhase]=useState("idle");const[count,setCount]=useState(0);const[label,setLabel]=useState("Press Start");const[size,setSize]=useState(140);
  useEffect(()=>{if(phase!=="running")return;let on=true;const go=async()=>{while(on){setLabel("Inhale...");setSize(210);setCount(c=>c+1);await new Promise(r=>setTimeout(r,4000));if(!on)break;setLabel("Hold...");await new Promise(r=>setTimeout(r,7000));if(!on)break;setLabel("Exhale...");setSize(140);await new Promise(r=>setTimeout(r,8000));}};go();return()=>{on=false;};},[phase]);
  return<div className="card" style={{maxWidth:420,textAlign:"center",padding:"30px"}}>
    <button className="btn btn-o btn-sm" style={{float:"left"}} onClick={onBack}>← Back</button>
    <div style={{clear:"both",fontFamily:"var(--serif)",fontSize:"1.3rem",marginBottom:4}}>Breathing Exercise</div>
    <div style={{color:"var(--mut)",fontSize:".76rem",marginBottom:20}}>4-7-8 · Cycles: {count}</div>
    <div style={{width:size,height:size,borderRadius:"50%",margin:"0 auto 22px",background:"radial-gradient(circle,rgba(88,196,160,.17),rgba(88,196,160,.03))",border:"2px solid rgba(88,196,160,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",fontWeight:600,color:"var(--acc)",transition:"all 1.2s ease",boxShadow:phase==="running"?"0 0 36px rgba(88,196,160,.28)":"none"}}>{label}</div>
    <div style={{display:"flex",gap:10}}>
      <button className="btn btn-g" style={{flex:1}} onClick={()=>setPhase(p=>p==="running"?"idle":"running")}>{phase==="running"?"⏸ Pause":"▶ Start"}</button>
      {count>=3&&<button className="btn btn-o" onClick={onDone}>✅ Done (+60 XP)</button>}
    </div>
  </div>;
}

function MemGame({onBack}){
  const[board,setBoard]=useState(()=>[...MEM_E,...MEM_E].sort(()=>Math.random()-.5).map((e,i)=>({id:i,e,f:false,m:false})));
  const[flipped,setFlipped]=useState([]);const[moves,setMoves]=useState(0);const[won,setWon]=useState(false);
  const flip=id=>{if(flipped.length===2)return;const c=board.find(x=>x.id===id);if(c.f||c.m)return;const nb=board.map(x=>x.id===id?{...x,f:true}:x);setBoard(nb);const nf=[...flipped,id];setFlipped(nf);if(nf.length===2){setMoves(m=>m+1);const[a,b]=nf.map(i=>nb.find(x=>x.id===i));if(a.e===b.e){const m2=nb.map(x=>nf.includes(x.id)?{...x,m:true}:x);setBoard(m2);setFlipped([]);if(m2.every(x=>x.m))setWon(true);}else setTimeout(()=>{setBoard(brd=>brd.map(x=>nf.includes(x.id)?{...x,f:false}:x));setFlipped([]);},800);}};
  return<div className="card" style={{maxWidth:360,textAlign:"center",padding:"26px"}}>
    <button className="btn btn-o btn-sm" style={{float:"left"}} onClick={onBack}>← Back</button>
    <div style={{clear:"both",fontFamily:"var(--serif)",fontSize:"1.25rem",marginBottom:5}}>Memory Match</div>
    <div style={{color:"var(--mut)",fontSize:".75rem",marginBottom:14}}>Moves: {moves} · {won?"🎉 You Won!":"Find all pairs"}</div>
    {won?<div style={{padding:"18px",color:"var(--acc)",fontWeight:600}}>🎉 Done in {moves} moves!<br/><button className="btn btn-g mt3" onClick={()=>{setBoard([...MEM_E,...MEM_E].sort(()=>Math.random()-.5).map((e,i)=>({id:i,e,f:false,m:false})));setFlipped([]);setMoves(0);setWon(false);}}>Play Again</button></div>
    :<div className="mem-grid">{board.map(c=><div key={c.id} className={`mc ${c.f?"fl2":""} ${c.m?"mt":""}`} onClick={()=>flip(c.id)}>{(c.f||c.m)?c.e:""}</div>)}</div>}
  </div>;
}

function GratGame({onBack,onDone}){
  const[items,setItems]=useState([]);const[inp,setInp]=useState("");const[saved,setSaved]=useState(false);
  const add=()=>{if(inp.trim()){setItems(a=>[...a,inp.trim()]);setInp("");}};
  return<div className="card" style={{maxWidth:440,padding:"26px"}}>
    <button className="btn btn-o btn-sm" style={{marginBottom:14}} onClick={onBack}>← Back</button>
    <div style={{fontFamily:"var(--serif)",fontSize:"1.25rem",marginBottom:5}}>Gratitude Jar 🌸</div>
    <div style={{color:"var(--mut)",fontSize:".78rem",marginBottom:18}}>What are you grateful for today?</div>
    {items.length===0&&<div style={{color:"var(--mut)",fontSize:".77rem",textAlign:"center",padding:"10px 0",marginBottom:10}}>Add something you're thankful for ✨</div>}
    {items.map((item,i)=><div key={i} style={{padding:"9px 13px",background:"var(--surf2)",borderRadius:10,marginBottom:7,fontSize:".83rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>{item}<span style={{cursor:"pointer",color:"var(--mut)",fontSize:".72rem",marginLeft:8}} onClick={()=>setItems(a=>a.filter((_,j)=>j!==i))}>✕</span></div>)}
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <input className="fi" placeholder="I am grateful for..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} style={{flex:1}}/>
      <button className="btn btn-g" onClick={add}>Add</button>
    </div>
    {items.length>=3&&!saved&&<button className="btn btn-g" style={{width:"100%"}} onClick={()=>{setSaved(true);onDone();}}>✅ Save & Earn +60 XP</button>}
  </div>;
}

function HistoryPage({checkins}){
  return(<>
    <div className="pt">Wellness History</div><div className="ps">Your encrypted mental health timeline 🔒</div>
    {checkins.length===0?<div className="card"><div className="empty"><div className="ei">📊</div>No check-ins yet.</div></div>
    :<div className="g2">
      <div className="card"><div className="ct">Mood Trend (last 7)</div>
        <div className="chart">{checkins.slice(-7).map((c,i)=><div key={i} className={`bar ${c.score<30?"dr":c.score<55?"wr":""}`} style={{height:`${c.score}%`}}/>)}</div>
        <div className="clb">{checkins.slice(-7).map((c,i)=><div key={i} className="cl">{c.day||"—"}</div>)}</div>
      </div>
      <div className="card"><div className="ct">Check-In Log</div>
        {checkins.slice().reverse().slice(0,10).map((c,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"8px 0",borderBottom:"1px solid var(--brd)"}}>
            <div style={{width:9,height:9,borderRadius:"50%",flexShrink:0,background:c.score<30?"var(--red)":c.score<55?"var(--warn)":"var(--acc)"}}/>
            <div style={{flex:1,fontSize:".82rem"}}>{c.emoji} {c.mood}</div>
            <div style={{fontSize:".7rem",color:"var(--mut)"}}>{c.date}</div>
            <div style={{fontSize:".78rem",fontWeight:600,color:c.score<30?"var(--red)":c.score<55?"var(--warn)":"var(--acc)"}}>{c.score}</div>
          </div>
        ))}
      </div>
    </div>}
  </>);
}

function CounselorDash({user,students,sessions,setPage}){
  const hr=new Date().getHours();const greet=hr<12?"Good Morning":hr<17?"Good Afternoon":"Good Evening";
  return(<>
    <div className="pt">{greet}, {user.name.split(" ")[0]} 👋</div>
    <div className="ps">Mind Mitra Counselor Portal · {new Date().toDateString()}</div>
    <div className="g4 mb4">{[{l:"Students",v:String(students.length),i:"👥",c:"var(--acc)"},{l:"Upcoming",v:String(sessions.filter(s=>s.status==="upcoming").length),i:"📅",c:"var(--pur)"},{l:"Revenue",v:`₹${sessions.filter(s=>s.paid).reduce((a,s)=>a+(s.fee||0),0)}`,i:"💰",c:"var(--warn)"},{l:"Pending Fees",v:`₹${sessions.filter(s=>!s.paid&&s.status!=="cancelled").reduce((a,s)=>a+(s.fee||0),0)}`,i:"⏳",c:"var(--red)"}].map(s=>(
      <div className="sc" key={s.l}><div style={{fontSize:"1.3rem",marginBottom:5}}>{s.i}</div><div style={{fontSize:"1.4rem",fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:".71rem",color:"var(--mut)",marginTop:5}}>{s.l}</div></div>
    ))}</div>
    <div className="card"><div className="ct">Upcoming Sessions</div>
      {sessions.filter(s=>s.status==="upcoming").length===0?<div className="empty"><div className="ei">📅</div>No upcoming sessions.</div>
      :sessions.filter(s=>s.status==="upcoming").slice(0,5).map(s=>(
        <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"1px solid var(--brd)"}}>
          <div style={{width:34,height:34,borderRadius:10,background:s.type==="video"?"rgba(123,104,238,.15)":s.type==="phone"?"rgba(88,196,160,.15)":"rgba(255,126,179,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".95rem",flexShrink:0}}>{s.type==="video"?"📹":s.type==="phone"?"📞":"🏫"}</div>
          <div style={{flex:1}}><div style={{fontSize:".83rem",fontWeight:600}}>{s.student}</div><div style={{fontSize:".71rem",color:"var(--mut)"}}>{s.date} · {s.time}</div></div>
          <span className={`bdg ${s.paid?"b-g":"b-w"}`}>{s.paid?"Paid":"Pending"}</span>
        </div>
      ))}
    </div>
  </>);
}

function CounselorBook({user,students,sendMessage,notify}){
  const[showModal,setShowModal]=useState(false);const[booked,setBooked]=useState([]);
  return(<>
    <div className="pt">Book Session</div><div className="ps">Schedule a session with a student</div>
    <button className="btn btn-g mb4" onClick={()=>setShowModal(true)}>+ Book New Session</button>
    {booked.length===0?<div className="card"><div className="empty"><div className="ei">📅</div>No sessions booked yet as counselor.</div></div>
    :booked.map((s,i)=>(
      <div className="sr" key={i}>
        <div className={`sr-ic ic-${s.type==="video"?"v":s.type==="phone"?"p":"i"}`}>{s.type==="video"?"📹":s.type==="phone"?"📞":"🏫"}</div>
        <div className="sr-info"><div className="sr-t">{s.type==="video"?"Video":s.type==="phone"?"Phone":"In-Person"} with {s.student}</div><div className="sr-m">{s.date} · {s.time}</div></div>
        <span className="bdg b-g">Booked</span>
      </div>
    ))}
    {showModal&&<div className="ov" onClick={()=>setShowModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <BookModal user={user} peers={students} forCounselor={true} sendMessage={sendMessage}
        onBook={async s=>{await FB.addSession(s);setBooked(p=>[...p,s]);setShowModal(false);notify("✅ Session Booked!","Student has been notified.");}}
        onClose={()=>setShowModal(false)}/>
    </div></div>}
  </>);
}

function StudentsPage({students,sendMessage,notify}){
  return(<>
    <div className="pt">Students</div><div className="ps">All registered students</div>
    {students.length===0?<div className="card"><div className="empty"><div className="ei">👥</div>No students registered yet.</div></div>
    :students.map((s,i)=>(
      <div className="card mb3" key={i}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"var(--surf2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>🎓</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:".93rem"}}>{s.name}</div>
            <div style={{fontSize:".73rem",color:"var(--mut)",marginTop:2}}>{s.email}{s.college?` · ${s.college}`:""}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:11}}>
          <button className="btn btn-p btn-sm" style={{flex:1}} onClick={async()=>{await sendMessage(s.email,"💬 Message from Counselor","Your counselor has sent you a message. Please check your notifications.","info");notify("✅ Sent",`Message sent to ${s.name}`);}}>📬 Send Message</button>
          <button className="btn btn-r btn-sm" style={{flex:1}} onClick={async()=>{await sendMessage(s.email,"🚨 Urgent Alert","Your counselor needs to speak with you urgently. Please respond or call iCall: 9152987821.","info");notify("🚨 Alert Sent",`Urgent alert sent to ${s.name}`);}}>🚨 Send Alert</button>
        </div>
      </div>
    ))}
  </>);
}

function AlertsPage({students,sendMessage,notify}){
  return(<>
    <div className="pt">Alerts</div><div className="ps">Send alerts and check-in with students</div>
    {students.length===0?<div className="card"><div className="empty"><div className="ei">👥</div>No students registered yet.</div></div>
    :students.map((s,i)=>(
      <div key={i} className="al-b" style={{flexDirection:"column",alignItems:"flex-start",gap:9}}>
        <div style={{display:"flex",alignItems:"center",gap:11,width:"100%"}}>
          <span style={{fontSize:"1.2rem"}}>🎓</span>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:".86rem"}}>{s.name}</div><div style={{fontSize:".73rem",color:"var(--mut)"}}>{s.email}{s.college?` · ${s.college}`:""}</div></div>
        </div>
        <div style={{display:"flex",gap:7,paddingLeft:35}}>
          <button className="btn btn-r btn-sm" onClick={async()=>{await sendMessage(s.email,"🚨 Counselor Alert","We've noticed you may be struggling. Please reach out immediately or call iCall: 9152987821.","info");notify("🚨 Alert Sent",`Emergency message sent to ${s.name}`);}}>🚨 Emergency Alert</button>
          <button className="btn btn-o btn-sm" onClick={async()=>{await sendMessage(s.email,"💙 Counselor Check-In","Your counselor wants to check in with you. How are you doing? Feel free to reply or book a session.","info");notify("✅ Check-In Sent",`Message sent to ${s.name}`);}}>💙 Check-In</button>
        </div>
      </div>
    ))}
  </>);
}
