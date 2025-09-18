<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReservation extends Notification
{
    use Queueable;

    protected $reservation;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($reservation)
    {
        $this->reservation = $reservation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database']; // Hanya gunakan database untuk saat ini
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
                    ->subject('Reservasi Baru')
                    ->line('Anda menerima notifikasi ini karena ada reservasi baru.')
                    ->line('Detail Reservasi:')
                    ->line('Nama: ' . $this->reservation->name) // Diperbaiki dari customer_name ke name
                    ->line('Tanggal: ' . $this->reservation->date) // Diperbaiki dari reservation_date ke date
                    ->line('Waktu: ' . $this->reservation->time) // Diperbaiki dari reservation_time ke time
                    ->action('Lihat Detail Reservasi', url('/reservations/' . $this->reservation->id))
                    ->line('Terima kasih telah menggunakan layanan kami!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'reservation_id' => $this->reservation->id,
            'customer_name' => $this->reservation->name,
            'reservation_date' => $this->reservation->date,
            'reservation_time' => $this->reservation->time,
            'reservation_number' => $this->reservation->reservationNumber,
            'message' => 'Reservasi baru dari ' . $this->reservation->name . ' untuk tanggal ' . 
                         $this->reservation->date . ' pukul ' . $this->reservation->time,
            'action_url' => '/dashboard/reservasi',
            'type' => 'new_reservation'
        ];
    }
}