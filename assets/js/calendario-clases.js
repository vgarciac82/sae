console.log("Cargando JS de calendario-clases.js");

var eventosBase = [
    {
        title: 'Grupo A1 – María Torres',
        start: '2025-08-19T09:00:00',
        end: '2025-08-19T10:00:00',
        extendedProps: {
            maestro: 'María Torres',
            grupo: 'A1',
            alumnos: 3,
            duracion: '60 mins',
            tipo: '1:1'
        }
    },
    {
        title: 'Grupo B2 – Juan Pérez',
        start: '2025-08-20T11:00:00',
        end: '2025-08-20T12:00:00',
        extendedProps: {
            maestro: 'Juan Pérez',
            grupo: 'B2',
            alumnos: 4,
            duracion: '60 mins',
            tipo: '4 Alumnos'
        }
    },
    {
        title: 'Grupo C3 – Ana Gómez',
        start: '2025-08-21T18:00:00',
        end: '2025-08-21T19:30:00',
        extendedProps: {
            maestro: 'Ana Gómez',
            grupo: 'C3',
            alumnos: 2,
            duracion: '90 mins',
            tipo: '3 Alumnos'
        }
    }
];

let calendar;

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const initialView = localStorage.getItem('calendarView') || 'timeGridWeek';

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: initialView,
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: eventosBase,
        eventClick: function (info) {
            const { grupo, maestro, alumnos, duracion, tipo } = info.event.extendedProps;

            Swal.fire({
                title: info.event.title,
                html: `
          <b>Grupo:</b> ${grupo}<br>
          <b>Maestro:</b> ${maestro}<br>
          <b>Alumnos:</b> ${alumnos}<br>
          <b>Duración:</b> ${duracion}<br>
          <b>Tipo:</b> ${tipo}
        `,
                icon: 'info',
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: 'Cerrar',
                denyButtonText: 'Cancelar Clase'
            }).then((result) => {
                if (result.isDenied) {
                    Swal.fire({
                        title: 'Cancelando clase...',
                        html: 'Notificando a los alumnos',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    setTimeout(() => {
                        info.event.setProp('title', '(Cancelada) ' + info.event.title);
                        info.event.setProp('backgroundColor', '#d9534f');
                        info.event.setProp('borderColor', '#d43f3a');

                        Swal.fire({
                            icon: 'success',
                            title: 'Clase cancelada',
                            text: 'Todos los alumnos han sido notificados',
                            confirmButtonText: 'Aceptar'
                        });
                    }, 1200);
                }
            });
        },
        datesSet: function (view) {
            localStorage.setItem('calendarView', view.view.type);
        }
    });

    calendar.render();

    $('#maestroFiltro, #tipoFiltro').on('change', function () {
        const maestro = $('#maestroFiltro').val();
        const tipo = $('#tipoFiltro').val();

        const filtrados = eventosBase.filter(e => {
            const matchMaestro = maestro ? e.extendedProps.maestro === maestro : true;
            const matchTipo = tipo ? e.extendedProps.tipo === tipo : true;
            return matchMaestro && matchTipo;
        });

        calendar.removeAllEvents();
        filtrados.forEach(ev => calendar.addEvent(ev));
    });
});
