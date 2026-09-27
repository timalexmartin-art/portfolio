// Entirely synthetic portfolio for interview practice. No production records or PHI.
export const snapshot = '2026-09-18';
export const statusOrder = ['Complete', 'In progress', 'On hold', 'Not started'];
export const issueDefinitions = {
  'Missing interface': {severity:'High', owner:'Interface services', action:'Locate the ServiceNow service using the contract reference, vendor alias, region, and demand number. Obtain owner confirmation before accepting a link.'},
  'Unverified match': {severity:'High', owner:'Interface architecture', action:'Compare the demand reference and endpoint metadata. Ask the interface owner to confirm the legal entity and intended use before accepting the candidate.'},
  'Missing catalog asset': {severity:'Medium', owner:'Data governance', action:'Create the Interface Services asset in Collibra with the verified technical identifier, data owner, and permitted use.'},
  'Missing relationship': {severity:'Medium', owner:'Data governance', action:'Publish the verified contract-to-interface relationship and attach its evidence reference in Collibra.'},
  'Pending attestation': {severity:'Low', owner:'Contract owner', action:'Confirm the documented permitted use and data ownership, then record the owner attestation.'}
};
const seeds = [
 ['Lone Star Health Exchange','TX','South','ADT'],
 ['Great Lakes Care Network','MI','Midwest','Care coordination'],
 ['Prairie Health Collaborative','KS','Midwest','Provider directory'],
 ['Palmetto Clinical Exchange','SC','Southeast','ADT'],
 ['Northwoods Health Alliance','WI','Midwest','Direct messaging'],
 ['Red River Care Exchange','OK','South','ADT'],
 ['Cumberland Health Connect','TN','Southeast','Care coordination'],
 ['Hoosier Clinical Network','IN','Midwest','ADT'],
 ['Gulf Coast Health Alliance','FL','Southeast','Provider directory'],
 ['Piedmont Care Exchange','NC','Southeast','ADT'],
 ['Heartland Provider Network','IL','Midwest','Direct messaging'],
 ['Blue Ridge Health Connect','VA','Southeast','Care coordination'],
 ['Coastal Bend Health Network','TX','South','ADT'],
 ['Lakeview Clinical Exchange','MI','Midwest','Provider directory'],
 ['Ozark Care Collaborative','AR','South','Care coordination'],
 ['Magnolia Health Exchange','AL','Southeast','ADT'],
 ['Flint Hills Care Network','KS','Midwest','Direct messaging'],
 ['Suncoast Clinical Alliance','FL','Southeast','Care coordination'],
 ['River Valley Health Connect','IN','Midwest','ADT'],
 ['Crossroads Health Exchange','TX','South','ADT'],
 ['Tennessee Valley Care Network','TN','Southeast','Care coordination'],
 ['Badger State Health Connect','WI','Midwest','Provider directory'],
 ['Sooner Clinical Alliance','OK','South','ADT'],
 ['Atlantic Care Collaborative','NC','Southeast','Direct messaging'],
 ['Gateway Health Exchange','MO','Midwest','ADT']
];
const issueMap={12:['Missing catalog asset'],13:['Missing catalog asset'],14:['Missing catalog asset'],15:['Missing relationship'],16:['Missing relationship'],17:['Pending attestation'],18:['Missing catalog asset','Pending attestation'],19:['Unverified match'],20:['Unverified match'],21:['Unverified match'],22:['Missing relationship','Pending attestation'],23:['Missing interface'],24:['Missing interface']};
export const contracts=seeds.map(([name,state,region,use],i)=>{
 const n=String(i+1).padStart(3,'0');
 const cats=issueMap[i]||[];
 const status=i<12?'Complete':i<19?'In progress':i<23?'On hold':'Not started';
 const interfaces=i>=23?[]:Array.from({length:i%3===0?2:1},(_,j)=>{
   const verified=!cats.includes('Unverified match');
   const catalog=verified&&!cats.includes('Missing catalog asset');
   const related=catalog&&!cats.includes('Missing relationship');
   return {id:`IF-${String(3100+i*2+j)}`,name:`${state}_${use==='ADT'?'ADT':use==='Care coordination'?'CARE':use==='Provider directory'?'PROV':'DIRECT'}_${j===0?'OUT':'ACK'}`,demand:`DMND00${8420+i}`,verified,catalog,related,asset:catalog?`COL-IS-${String(6100+i*2+j)}`:null,protocol:use==='ADT'?'HL7 v2 / MLLP':use==='Direct messaging'?'Direct secure messaging':use==='Provider directory'?'SFTP / CSV':'FHIR R4 / HTTPS',direction:j===0?'Outbound':'Inbound acknowledgment',endpoint:`${state.toLowerCase()}-${n}-${j+1}.example.invalid`,fields:use==='ADT'?['PID-3 · Patient identifier','PV1-2 · Patient class','EVN-2 · Event time']:use==='Provider directory'?['NPI · Provider identifier','Specialty code','Practice address']:['Patient identifier','Encounter reference','Care team identifier'],owner:`${state} Interface Services`,verifiedOn:verified?'2026-09-15':null};
 });
 return {id:`CGA-2026-${n}`,name,state,region,use,status,owner:`${region} Data Steward`,legalOwner:`${state} Contract Operations`,signed:`2026-${String(2+i%6).padStart(2,'0')}-${String(5+i%19).padStart(2,'0')}`,reviewed:'2026-09-18',demand:`DMND00${8420+i}`,dsa:`DSA-${state}-${n}`,contractAsset:`COL-HIE-${4100+i}`,attested:!cats.includes('Pending attestation')&&i<23,interfaces,issues:cats.map((type,j)=>({id:`EX-${n}-${j+1}`,type,...issueDefinitions[type],age:5+(i*3+j)%32,evidence:type==='Unverified match'?'Vendor alias matches; demand reference needs owner confirmation.':type==='Missing interface'?'Signed agreement is present; no ServiceNow match has been accepted.':type==='Missing catalog asset'?'Verified ServiceNow interface exists; no catalog asset was found.':type==='Missing relationship'?'Both catalog assets exist; the relation is absent.':'Technical links are present; permitted-use attestation is awaiting review.'})),matchBasis:i>=23?'No accepted match':cats.includes('Unverified match')?'Vendor alias + region; demand reference not confirmed':'Contract reference + demand number + owner confirmation'};
});
export function isComplete(c){return c.interfaces.length>0&&c.interfaces.every(i=>i.verified&&i.catalog&&i.related)&&c.attested&&c.issues.length===0;}
export function summarize(rows){
 const linked=new Set(rows.flatMap(c=>c.interfaces.filter(i=>i.verified).map(i=>i.id)));
 return {contracts:rows.length,interfaces:linked.size,linkedContracts:rows.filter(c=>c.interfaces.some(i=>i.verified)).length,complete:rows.filter(isComplete).length,exceptions:rows.reduce((s,c)=>s+c.issues.length,0),affected:rows.filter(c=>c.issues.length).length};
}
