import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function EMIScheduleTable({loanId}){
  const [rows, setRows] = useState([]);

  useEffect(()=>{
    if(!loanId) return;
    axios.get(`/api/loans/${loanId}/schedule`).then(r=>setRows(r.data)).catch(()=>setRows([]));
  },[loanId]);

  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr>
          <th>EMI #</th>
          <th>Due Date</th>
          <th>Principal</th>
          <th>Interest</th>
          <th>Remaining</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td>{r.emiNumber}</td>
            <td>{r.dueDate}</td>
            <td>{r.principalComponent}</td>
            <td>{r.interestComponent}</td>
            <td>{r.remainingBalance}</td>
            <td>{r.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
