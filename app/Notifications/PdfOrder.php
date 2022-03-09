<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Support\Str;
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
    public function via()
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail()
    {

        $username = strtolower(Str::slug($this->user->name));
        $filename = 'porudzbenica_tonera_' . $username . '_' . date('m') . '_' . date('Y') . '.pdf';
        $file_to_attach = storage_path('reports/users/' . $this->user->id . '/' . $filename);

        return (new MailMessage)
                    ->greeting('Dobar dan, ' . $this->user->name)
                    ->subject('Vaša porudžbenica za ' . (int) date('m') . '. mesec')
                    ->line('U ovom mejlu nalazi vam se vaša porudžbenica tonera za trenutni mesec.')
                    ->line('Hvala vam što koristite aplikaciju.')
                    ->attach($file_to_attach, [
                        'as' => $filename,
                        'mime' => 'text/pdf',
                    ]);
    }

}
