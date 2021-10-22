//send&save email
function send_mail(e){
document.addEventListener('DOMContentLoaded', function(){
document.getElementById('compose-form').addEventListener('submit', function(e){
e.preventDefault()
const rec=document.getElementById('rec')
const recipient=document.querySelector('#compose-recipients').value
const subject=document.querySelector('#compose-subject').value
const body=document.querySelector('#compose-body').value

fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: recipient ,
      subject: subject,
      body: body
  })
})
.then(response => response.json())
.then(result => {
    // Print result

    console.log(result);


});
 //.then(response => load_mailbox('sent'))

})
})
}



function display_emails(){
fetch('/emails/sent')
.then(response => response.json())
.then(emails => {
    // Print emails
    console.log(emails);


    // ... do something else with emails ...
 for(let i of emails ){
    document.querySelector('#email-view').innerHTML += `${i.recipients} ${i.body}`
    }
});

}
display_emails()




function show(emails) {
    let tab =
        `<tr>
          <th>Name</th>
          <th>Office</th>
          <th>Position</th>
          <th>Salary</th>
         </tr>`;

    // Loop to access all rows
    for (let r of data.list) {
        tab += `<tr>
    <td>${r.name} </td>
    <td>${r.office}</td>
    <td>${r.position}</td>
    <td>${r.salary}</td>
</tr>`;
    }
    // Setting innerHTML as tab variable
    document.getElementById("employees").innerHTML = tab;
}



/////working function

function display_sent_mails(){
fetch('/emails/sent')
.then(response => response.json())
.then(emails => {
    // Print emails
    console.log(emails);


    // ... do something else with emails ...
    let tab =
        `<tr>

          <th></th>
          <th></th>
          <th></th>
         <th></th>
         <th></th>

         </tr>`;
  //Loop to fill rows
    for(let r of emails ){
       tab += `<tr>

   <td>${r.recipients} </td>
    <td>${r.subject} </td>
    <td> </td>
    <td>${r.timestamp}</td>
    <td>${r.id} </td>

</tr>`;
    }
    // Setting innerHTML as tab variable
    document.getElementById("outbox").innerHTML = tab;
});

}



//mark as read
function read_email(id){
fetch(`/emails/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
})

}

//btns.forEach(function(btn){
//btn.addEventListener('click', function(){
//console.log('clicked')
//})

//})

//btns.forEach(function(btn){
//btn.addEventListener('click', function(){
//display_sent_mails()
//display_inbox_mails()
//display_archived_mails()

//})

//}