

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_mail)

  // By default, load the inbox
 load_mailbox('inbox');
});

const form=document.getElementById('compose-form')


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#single_mail_view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

 // if(validateEmail( document.querySelector('#compose-recipients').value)){
//return true
//}else{

//document.getElementById('alert').textContent='Invalid email'
//}
  // Clear out composition fields
 document.querySelector('#compose-recipients').value = '';
 document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';



}

function load_mailbox(mailbox) {

   get_latest_API(mailbox)
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single_mail_view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 load_view(mailbox)

}
//toggle between mails
function load_view(mailbox){
if( mailbox=='inbox'){
  document.getElementById("outbox").style.display = 'none'
   document.getElementById("inboxMails").style.display = 'block'
   document.getElementById('alert').textContent=''
   document.getElementById("archivedMails").style.display = 'none'
  }else if(mailbox=='archive') {
  document.getElementById("outbox").style.display = 'none'
  document.getElementById("inboxMails").style.display = 'none'
  document.getElementById("archivedMails").style.display = 'block'
  }else{
  document.getElementById("outbox").style.display = 'block'
  document.getElementById("inboxMails").style.display = 'none'
  document.getElementById("archivedMails").style.display = 'none'
  }

}





//send email
function send_mail(e){
//prevent loading inbox

e.preventDefault()

const recipient=document.querySelector('#compose-recipients').value
const subject=document.querySelector('#compose-subject').value
const body=document.querySelector('#compose-body').value
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(String(recipient).toLowerCase())===false){
  //e.preventDefault
  document.getElementById('alert').textContent='Invalid email'
   return false
  }else{
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

});


  }

document.getElementById('alert').textContent='Sent successfully'

get_latest_API('sent')
load_mailbox('sent')

display_sent_mails()
}


//display sent emails
function display_sent_mails(){
fetch('/emails/sent')
.then(response => response.json())
.then(emails => {
    // Print emails
   // console.log(emails);


    // ... do something else with emails ...
    let tab = ``;
         //let element = document.createElement('div');
         //document.querySelector('#outbox').appendChild(element)

  //Loop to fill rows
   for(let r of emails ){
       tab += `<tr id='${r.id}' class="form-control">
    <td>${r.recipients} </td>
    <td>${r.subject}</td>
    <td> </td>
    <td>${r.timestamp} </td>
     <td>${r.id}</td>

</tr>

`
    }

    // Setting innerHTML as tab variable

    document.getElementById("outbox").innerHTML = tab;
     //open email
    for(let r of emails){
     document.getElementById(r.id).addEventListener('click',function(){
     load_mail(r.id)
     })
     }


});

}
//load  mail
function load_mail(id){
fetch(`/emails/${id}`)
.then(response => response.json())
.then(email => {
    // mark as read
   fetch(`/emails/${email.id}`, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
})
display_single_mail(email)

});
}
//display mail
function  display_single_mail(email){
let email_info=`
<ul>
<li><strong>From:</strong><span>${email.sender}</span></li>
<li><strong>To:</strong><span>${email.recipients}</span></li>
<li><strong>Subject:</strong><span>${email.subject}</span></li>
<li><strong>Body:</strong><span>${email.body}</span></li>
<li><strong>Time:</strong><span>${email.timestamp}</span></li>
</ul>
<button type='button' id='reply'>Reply</button>
<button type='button' id='archiveBtn'>Archive</button>
<button type='button' id='unarchiveBtn'>Unarchive</button>

`


//load view and buttons
const user=(document.getElementById('user').innerHTML)
if(email.archived){
document.querySelector("#archivedMails").innerHTML=email_info
document.getElementById('reply').style.display='none'
document.getElementById('archiveBtn').style.display='none'
}
else if(user==email.sender){
document.querySelector("#outbox").innerHTML=email_info
document.getElementById('archiveBtn').style.display='none'
document.getElementById('unarchiveBtn').style.display='none'
document.getElementById('reply').style.display='none'
}else{
document.querySelector("#inboxMails").innerHTML=email_info
document.getElementById('unarchiveBtn').style.display='none'
}

reply(email)
archive_mail(email)

//load view
const btns=document.querySelectorAll("#sent,#inbox,#archived")
btns.forEach(function(btn){
btn.addEventListener('click', function(){
display_sent_mails()
display_inbox_mails()
display_archived_mails()
})
})
}

//display inbox emails
function display_inbox_mails(){
fetch('/emails/inbox')
.then(response => response.json())
.then(emails => {
    // Print emails
    //console.log(emails);


    // ... do something else with emails ...
    const element = document.createElement('div');
    let tab =``

  //Loop to fill rows
    for(let r of emails ){
       tab += `<tr id='${r.id}' class='tr'>
    <td class='sender'>${r.sender}</td>
    <td class='subject'>${r.subject}</td>
    <td class='time'>${r.timestamp} </td>

</tr>

`;

    }

    // Setting innerHTML as tab variable
    document.getElementById("inboxMails").innerHTML = tab;

        emails.forEach(email => {
        //console.log(email.read)
        if(email.read){document.getElementById(email.id).style.backgroundColor='gray'}
        else{
        document.getElementById(email.id).style.backgroundColor='white'
        }
});
//open mail
for(let r of emails){
     document.getElementById(r.id).addEventListener('click',function(){
     load_mail(r.id)
     })
     }


});

}



//display archived
function display_archived_mails(){
fetch('/emails/archive')
.then(response => response.json())
.then(emails => {
    // Print emails
  //  console.log(emails);


    // ... do something else with emails ...
    const element = document.createElement('div');
    let tab =``

  //Loop to fill rows
    for(let r of emails ){
       tab += `<tr id='${r.id}' class="form-control">
    <td>${r.recipients} </td>
    <td>${r.subject}</td>
    <td> </td>
    <td>${r.timestamp} </td>
     <td>${r.id}</td>

</tr>

`;

    }
    // Setting innerHTML as tab variable
    document.getElementById("archivedMails").innerHTML = tab;
for(let r of emails){

     document.getElementById(r.id).addEventListener('click',function(){
     load_mail(r.id)
     })
     }


});

}
//reply
function reply(email){
const replyBtn=document.getElementById('reply')
replyBtn.addEventListener('click', function(){
compose_email()
document.querySelector('#compose-recipients').value = `${email.sender}`
document.querySelector('#compose-recipients').disabled = true;
 document.querySelector('#compose-subject').value = `RE: ${email.subject}`;
 document.querySelector('#compose-subject').disabled = true;
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;

})
}

//mark as archived/unarchived
function archive_mail(email){
const unarchiveBtn=document.getElementById('unarchiveBtn')
const archiveBtn=document.getElementById('archiveBtn')
//archive
archiveBtn.addEventListener('click', function(){

fetch(`/emails/${email.id}`, {
  method: 'PUT',
  body: JSON.stringify({
      archived: true
  })
})
load_mailbox('inbox')
display_inbox_mails()
})
//unarchive
unarchiveBtn.addEventListener('click', function(){

console.log('clicked')
//load_mailbox('archive')
fetch(`/emails/${email.id}`, {
  method: 'PUT',
  body: JSON.stringify({
      archived: false
  })
})
load_mailbox('inbox')
display_inbox_mails()
})
}





display_sent_mails()
display_inbox_mails()
display_archived_mails()

function get_latest_API(mailbox){
fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
    })
}


function validateEmail() {
 let myrec=document.querySelector('#compose-recipients').value
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(String(myrec).toLowerCase())===false){
  //e.preventDefault
  document.getElementById('alert').textContent='Invalid email'
   return false
  }else{
  return true
  }
}





