import { extract as parseRawEmail } from 'letterparser';

export default {
    async email(message, env, ctx) {
      
      const remote = 'https://app.userscom.com/api/create-ticket-from-worker'; 
  
      const rawEmail = await new Response(message.raw).text();
      console.log("rawEmail..", rawEmail)
      const emailText = extractEmailText(rawEmail);
      console.log("emailText...", emailText);
  
      const requestData = {
          from: message.from,
          to: message.to,
          subject: message.headers.get('subject'),
          email_message: emailText
      };
  
      const requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json' 
          },
          body: JSON.stringify(requestData) 
      };
  
      try {
          const res = await fetch(remote, requestOptions);
          if (!res.ok) {
              throw new Error('Network response was not ok');
          }
          const responseData = await res.json(); 
          console.log("responseData...", responseData); 
      } catch (error) {
          console.error('Error posting data:', error);
      }
    }
  }
  
  // Function to extract email text from raw email content
  function extractEmailText(rawEmail) {
      // Find the last occurrence of "Content-Type" header
      const contentTypeIndex = rawEmail.lastIndexOf('Content-Type');
      if (contentTypeIndex === -1) {
          // If "Content-Type" header is not found, return the entire email content
          return rawEmail;
      } else {
          // Extract email text after the last occurrence of "Content-Type" header
          return rawEmail.substring(contentTypeIndex);
      }
  }
  