<?php

namespace App\Notifications;

use App\Models\ReminderDate;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AutomaticOrderCopyNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $reminder;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(ReminderDate $reminder)
    {
        $this->reminder = $reminder;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->greeting('Dobar dan!')
                    ->subject('Automatsko kopiranje porudžbenice')
                    ->line('Podesili ste automatsko kopiranje vaše prošle porudžbenice.')
                    ->line('Uspešno ste podesili automatsko kopiranje vaše porudžbine iz prošlog meseca. Izabrani datum kad će se to dogoditi je ' . $this->reminder->reminder_date->format('d.m.Y') . '. Dobićete email obaveštenje kad se ova radnja završi.')
                    ->line('Hvala na korišćenju aplikacije.');
    }
}
