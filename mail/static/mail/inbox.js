document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  // By default, load the inbox
  load_mailbox('inbox');
  document.querySelector("#compose-form").onsubmit = sendmail; 
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mail-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //getting the mail box
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails)
    console.log(`${mailbox}`);
    let mail = [];

    emails.forEach( emails => 
      mail.push(emails)
    )
    console.log(mail.length);

    
    mail.forEach( mail => getmail(mail,mailbox))
  })
  
}

function sendmail() 
{
    const recipients = document.querySelector('#compose-recipients')
    const subject = document.querySelector('#compose-subject')
    const body = document.querySelector('#compose-body')

    if (!recipients.value )
    {
      alert('Invalid recipient');
    }
    else if (!subject.value)
    {
      alert('No subject!');
    }
    else if (!body.value)
    {
      alert('Invalid Body');
    }
    else {

    fetch('/emails',{
      method: 'POST',
      body: JSON.stringify({


        recipients: `${recipients.value}`,
        subject: `${subject.value}`,
        body: `${body.value}`
  
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      });
     localStorage.clear()
     load_mailbox('sent')
     return false
    }
   
};



function getmail(mail,mailbox) 
{
  if(mailbox === 'inbox')
  { 
    const inbox_views= document.createElement('div')
    inbox_views.id = 'inbox-views'
    document.querySelector("#emails-view").append(inbox_views)
     if (mail.archived === false)
     {
        view_inbox(mail,mailbox)
     }
    

  }
  else if (mailbox === 'sent')
  { 
    const isent_views= document.createElement('div')
    isent_views.id = 'isent-views'
    document.querySelector("#emails-view").append(isent_views)
    view_sent_box(mail,mailbox)
  }
  else if (mailbox === 'archive' )
  {
    const a_views= document.createElement('div')
    a_views.id = 'a-views'
    document.querySelector("#emails-view").append(a_views)
    archive_box(mail,mailbox)
  }
}

function email_archive(email_id, previousValue,mailbox)
{
  const newValue = !previousValue;
  console.log(`${newValue}`);
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: newValue
    })
  })
  load_mailbox(mailbox);
  window.location.reload();
}

function view_email_detail(email_id,mailbox)
{
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'block';
  const element = document.createElement('div');
      element.id = 'email-deatil';


  

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(mail => 
    {
      mark_read(email_id);
      const subject = document.createElement('div');
      const body = document.createElement('div');
      const timestamp = document.createElement('div');
      const sender = document.createElement('div');
      const recipients = document.createElement('div');
      const reply = document.createElement('button');
      const archive = document.createElement('button')
      reply.id = 'reply-btn';
      archive.id = "archive-btn"
      const br = document.createElement('hr');
      document.querySelector('#mail-view').append(element);


      reply.innerHTML = 'Reply';
      reply.classList = "btn btn-sm btn-outline-primary";
      
      archive.classList = "btn btn-sm btn-outline-primary";
      archive.style.cssText = 'float:right';

      subject.innerHTML = `Subject: ${mail.subject}`
      body.innerHTML = `${mail.body}`;
      timestamp.innerHTML = `Timestamp: ${mail.timestamp}`;
      sender.innerHTML = `From: ${mail.sender}`;
      recipients.innerHTML = `To: ${mail.recipients[0]}`;

      if (mail.archived === false)
      {
        archive.innerHTML = 'Archive';
      }
      else
      {
        archive.innerHTML = 'Unarchive';
      }

      element.append(sender);
      element.append(recipients);
      element.append(subject);
      element.append(timestamp);
      element.append(reply);
      element.append(archive);
      element.append(br);
      element.append(body);

      console.log(mail.id, mail.archived,mailbox)


      document.querySelector('#archive-btn').addEventListener('click', ()=> email_archive(email_id, mail.archived,mailbox))
      document.querySelector('#reply-btn').addEventListener('click', ()=> reply_email(mail));

    })
  

};

function reply_email(mail)
{
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mail-view').style.display = 'none';


  document.querySelector('#compose-recipients').value = mail.sender 
  document.querySelector('#compose-subject').value = 'Re: ' + mail.subject;
  document.querySelector('#compose-body').value = '';
  // `\n \n on ${mail.timestamp} ${mail.sender} wrote:\n${mail.body}`;

}


function mark_read(email_id)
{
  console.log('upadating email as read');
  fetch(`/emails/${email_id}`,
  {
    method: 'PUT',
    body: JSON.stringify(
    {
      read: true
    })
  })

}

function view_inbox(mail,mailbox)
{
  if (mail.archived === false)
  {
  const element = document.createElement('div');
  element.setAttribute('id', 'inbox-element');
    
    const par1 = document.createElement('div');
    const par2= document.createElement('div');
    const par3 = document.createElement('div');


    element.style.cssText =`margin: 0; width: 100%;font-size: 20px; padding: 10px;border: 1px solid black; display: inline-block;`;  
    par1.style.cssText=`float:left; margin-right:10px;`
    par2.style.cssText = `float:left; max-width: 30%; max-height: 30px;overflow-x: auto;white-space: nowrap;`
    par3.style.cssText =`float:right;max-width: 30%; max-height: 30px;overflow-x: auto;white-space: nowrap; color:#a6a6a6`
    element.classList.add('btn');
  
    par1.innerHTML = `${mail.sender}`.bold();
    par2.innerHTML = `${mail.subject}`;
    par3.innerHTML = `${mail.timestamp}`;

    element.append(par1);
    element.append(par2);
    element.append(par3);
    
    //const element1 = document.getElementById("inbox-element")
    
    document.querySelector('#inbox-views').append(element);

    if (mail.read == true)
    {
      element.style.backgroundColor = '#e6e6e6'
    }

    document.querySelector('#mail-view').innerHTML = ''; 
    
    element.addEventListener('click', () => view_email_detail(mail.id,mailbox));
  }

}

function view_sent_box(mail,mailbox)
{
  const element2 = document.createElement('div');
  element2.id = "sent-element";


    if (mail.sender === document.querySelector('#sender-id').value )
    {
      const par1 = document.createElement('div');
      const par2= document.createElement('div');
      const par3 = document.createElement('div');


      element2.style.cssText =`margin: 0; width: 100%;font-size: 20px; padding: 10px;border: 1px solid black; display: inline-block;`;
      par1.style.cssText=`float:left; margin-right:10px;`
      par2.style.cssText = `float:left; max-width: 30%; max-height: 30px;overflow-x: auto;white-space: nowrap;`
      par3.style.cssText =`float:right;max-width: 30%; max-height: 30px;overflow-x: auto;white-space: nowrap; color:#a6a6a6`        
      element2.classList.add('btn');

      
      par1.innerHTML = `${mail.sender}`.bold();
      par2.innerHTML = `${mail.subject}`;
      par3.innerHTML = `${mail.timestamp}`;

      element2.append(par1);
      element2.append(par2);
      element2.append(par3);

      document.querySelector('#isent-views').append(element2);

      
      document.querySelector('#mail-view').innerHTML = ''; 
      element2.addEventListener('click', () => view_email_detail(mail.id,mailbox));
    }  
}

function archive_box(mail,mailbox)
{
  { 
    const element1 = document.createElement('div');
    element1.id = "archive-element";

    if (mail.archived == true )
    {
      const par1 = document.createElement('div');
      const par2= document.createElement('div');
      const par3 = document.createElement('div');


      element1.style.cssText =`margin: 0; width: 100%;font-size: 20px; padding: 10px;border: 1px solid black; display: inline-block;`;
      par1.style.cssText=`float:left; margin-right:10px;`
      par2.style.cssText = `float:left; max-width: 30%; max-height: 30px;overflow-x: auto;white-space: nowrap;`
      par3.style.cssText =`float:right;max-width: 30%; max-height: 30px;overflow-x: auto;white-space: nowrap; color:#a6a6a6`
      element1.classList.add('btn');

      
      par1.innerHTML = `${mail.sender}`.bold();
      par2.innerHTML = `${mail.subject}`;
      par3.innerHTML = `${mail.timestamp}`;

      element1.append(par1);
      element1.append(par2);
      element1.append(par3);

      document.querySelector('#a-views').append(element1)


      document.querySelector('#mail-view').innerHTML = ''; 
      element1.addEventListener('click', () => view_email_detail(mail.id,mailbox));
    }
  }}