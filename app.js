let ingresos = [];
let gastos = [];

function agregarIngreso() {
    const descripcion = document.getElementById('descripcionIngreso').value;
    const monto = parseFloat(document.getElementById('montoIngreso').value);
    
    if (descripcion && monto > 0) {
        ingresos.push({ descripcion, monto, fecha: new Date().toLocaleDateString() });
        
        document.getElementById('descripcionIngreso').value = '';
        document.getElementById('montoIngreso').value = '';
        
        actualizarResumen();
        mostrarTransacciones();
    } else {
        alert('Por favor completa todos los campos correctamente');
    }
}

function agregarGasto() {
    const descripcion = document.getElementById('descripcionGasto').value;
    const monto = parseFloat(document.getElementById('montoGasto').value);
    
    if (descripcion && monto > 0) {
        gastos.push({ descripcion, monto, fecha: new Date().toLocaleDateString() });
        
        document.getElementById('descripcionGasto').value = '';
        document.getElementById('montoGasto').value = '';
        
        actualizarResumen();
        mostrarTransacciones();
    } else {
        alert('Por favor completa todos los campos correctamente');
    }
}

function actualizarResumen() {
    const totalIngresos = ingresos.reduce((sum, item) => sum + item.monto, 0);
    const totalGastos = gastos.reduce((sum, item) => sum + item.monto, 0);
    const balance = totalIngresos - totalGastos;
    
    document.getElementById('totalIngresos').textContent = totalIngresos.toFixed(2);
    document.getElementById('totalGastos').textContent = totalGastos.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
}

function mostrarTransacciones() {
    const lista = document.getElementById('listaTransacciones');
    lista.innerHTML = '';
    
    const todasTransacciones = [
        ...ingresos.map(i => ({ ...i, tipo: 'ingreso' })),
        ...gastos.map(g => ({ ...g, tipo: 'gasto' }))
    ];
    
    todasTransacciones.forEach(t => {
        const div = document.createElement('div');
        div.className = `transaccion ${t.tipo}`;
        div.innerHTML = `
            <div>
                <strong>${t.descripcion}</strong>
                <br><small>${t.fecha}</small>
            </div>
            <div class="monto-${t.tipo}">
                ${t.tipo === 'ingreso' ? '+' : '-'}$${t.monto.toFixed(2)}
            </div>
        `;
        lista.appendChild(div);
    });
}