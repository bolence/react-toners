<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PdfOrder extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
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

        $username = strtolower($this->user->name);
        $filename = 'porudzbenica_tonera_' . $username . '_' . date('m') . '_' . date('Y') . '.pdf';
        $file_to_attach = storage_path('reports/users/' . $this->user->id . '/' . $filename);

        return (new MailMessage)
                    ->greeting('Dobar dan, ' . $this->user->name)
                    ->subject('Vaša porudžbenica za ' . date('m') . 'mesec')
                    ->line('U ovom mejlu nalazi vam se vaša porudžbenica tonera za ovaj mesec.')
                    ->line('Hvala vam što koristite aplikaciju.')
                    ->attach($file_to_attach, [
                        'as' => $filename,
                        'mime' => 'text/pdf',
                    ]);
    }

}
