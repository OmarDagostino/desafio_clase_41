import Swal from 'sweetalert2';

export async function elegirIdioma() {
    console.log ('*** elegir idioma ***')
    // const respuesta = await Swal.fire({
    //     title: 'Elige el idioma / Choose language',
    //     input: 'text',
    //     inputLabel: 'sp => para español / en => for English',
    //     inputPlaceholder: 'en',
    // });
    let respuesta= {value:'en'}
    console.log ('** respuesta**', respuesta)

    if (respuesta.value === 'sp') {
        Swal.fire('Elegiste español');
        return 'sp';
    } else if (respuesta.value === 'en') {
        Swal.fire('Chose English');
        return 'en';
    } else {
        // Mostrar mensaje de elección inválida y asumir inglés
        Swal.fire('Elección inválida, se asume inglés / Invalid option, English is assumed');
        return 'en'; // Asumir inglés en caso de elección inválida
    }
}

