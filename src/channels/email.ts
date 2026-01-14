import { Resend } from 'resend';
import type { NotificationJob } from '../types/notification';
import { config } from '../config';

const resend = new Resend(config.EMAIL_APIKEY);

export const emailHandler = async (notification: NotificationJob): Promise<boolean> => {
    // Integrating this into an application, you would extract the email here from the userID and use that to send the email to the user
    let email = "taciturn2021@gmail.com"
    try {
        resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: notification.content.subject || "Subject Missing",
        html: `<p>${notification.content.message}</strong>!</p>`
      });
      return true
    }
    catch(e){
        console.log("Error occurred: ",e )
        return false
    }
  };
  
