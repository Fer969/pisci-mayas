// JavaScript específico para la página de galería

document.addEventListener('DOMContentLoaded', function() {
    
    // Datos de las imágenes de la galería
    const galleryImages = [
        {
            src: 'images/galeria/lagunas-produccion.jpg',
            title: 'Lagunas de Producción',
            description: 'Instalaciones especializadas para el cultivo de Tilapia Roja con sistemas de filtración y oxigenación.',
            category: 'instalaciones',
            alt: 'Lagunas de producción de Tilapia Roja'
        },
        {
            src: 'images/galeria/proceso-alimentacion.jpg',
            title: 'Proceso de Alimentación',
            description: 'Sistema de alimentación balanceada para garantizar el crecimiento óptimo de nuestros peces.',
            category: 'procesos',
            alt: 'Proceso de alimentación de Tilapia Roja'
        },
        {
            src: 'images/galeria/cosecha-tilapia.jpg',
            title: 'Cosecha de Tilapia Roja',
            description: 'Proceso especializado de cosecha que garantiza la frescura y calidad del producto.',
            category: 'produccion',
            alt: 'Cosecha de Tilapia Roja'
        },
        {
            src: 'images/galeria/instalaciones.jpg',
            title: 'Instalaciones Principales',
            description: 'Infraestructura moderna diseñada para la producción sustentable de Tilapia Roja.',
            category: 'instalaciones',
            alt: 'Instalaciones de la piscícola'
        },
        {
            src: 'images/galeria/sistema-filtracion.jpg',
            title: 'Sistema de Filtración',
            description: 'Tecnología avanzada de filtración y tratamiento de agua para mantener la calidad óptima.',
            category: 'procesos',
            alt: 'Sistema de filtración de agua'
        },
        {
            src: 'images/galeria/equipo-tecnico.jpg',
            title: 'Equipo Técnico',
            description: 'Personal especializado en acuicultura y manejo de Tilapia Roja con años de experiencia.',
            category: 'equipo',
            alt: 'Equipo técnico especializado'
        },
        // Imágenes adicionales que se pueden agregar fácilmente
        {
            src: 'images/galeria/placeholder-1.jpg',
            title: 'Monitoreo de Calidad',
            description: 'Control constante de parámetros de agua para garantizar las mejores condiciones.',
            category: 'procesos',
            alt: 'Monitoreo de calidad del agua',
            placeholder: true
        },
        {
            src: 'images/galeria/placeholder-2.jpg',
            title: 'Alevines de Tilapia',
            description: 'Crías de alta calidad genética para el desarrollo de nuevas generaciones.',
            category: 'produccion',
            alt: 'Alevines de Tilapia Roja',
            placeholder: true
        },
        {
            src: 'images/galeria/placeholder-3.jpg',
            title: 'Laboratorio de Análisis',
            description: 'Instalaciones de laboratorio para análisis de calidad y control sanitario.',
            category: 'instalaciones',
            alt: 'Laboratorio de análisis',
            placeholder: true
        },
        {
            src: 'images/galeria/placeholder-4.jpg',
            title: 'Proceso de Empaque',
            description: 'Empaque especializado que mantiene la frescura del producto hasta el consumidor final.',
            category: 'procesos',
            alt: 'Proceso de empaque',
            placeholder: true
        },
        {
            src: 'images/galeria/placeholder-5.jpg',
            title: 'Equipo de Producción',
            description: 'Nuestro equipo trabajando en las diferentes etapas del proceso productivo.',
            category: 'equipo',
            alt: 'Equipo de producción',
            placeholder: true
        },
        {
            src: 'images/galeria/placeholder-6.jpg',
            title: 'Vista Aérea de la Piscícola',
            description: 'Vista panorámica de nuestras instalaciones y el entorno natural que nos rodea.',
            category: 'instalaciones',
            alt: 'Vista aérea de la piscícola',
            placeholder: true
        }
    ];

    // Variables globales
    let currentFilter = 'all';
    let displayedImages = 6; // Mostrar 6 imágenes inicialmente
    let allImages = [...galleryImages];

    // Elementos del DOM
    const galleryContainer = document.getElementById('gallery-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const downloadBtn = document.getElementById('download-btn');

    // Inicializar la galería
    function initGallery() {
        renderGallery();
        setupEventListeners();
    }

    // Renderizar la galería
    function renderGallery() {
        const filteredImages = getFilteredImages();
        const imagesToShow = filteredImages.slice(0, displayedImages);
        
        galleryContainer.innerHTML = '';
        
        imagesToShow.forEach((image, index) => {
            const galleryItem = createGalleryItem(image, index);
            galleryContainer.appendChild(galleryItem);
        });

        // Mostrar/ocultar botón de cargar más
        if (filteredImages.length > displayedImages) {
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Crear elemento de galería
    function createGalleryItem(image, index) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 col-sm-6';
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in';
        galleryItem.setAttribute('data-category', image.category);
        galleryItem.setAttribute('data-index', index);
        
        if (image.placeholder) {
            // Crear placeholder para imágenes que no existen
            galleryItem.innerHTML = `
                <div class="gallery-placeholder">
                    <i class="fas fa-image"></i>
                    <h6>${image.title}</h6>
                    <p>Imagen próximamente</p>
                </div>
                <div class="gallery-overlay">
                    <span class="category-badge">${getCategoryName(image.category)}</span>
                    <h5>${image.title}</h5>
                    <p>${image.description}</p>
                </div>
            `;
        } else {
            galleryItem.innerHTML = `
                <img src="${image.src}" alt="${image.alt}" loading="lazy">
                <div class="gallery-overlay">
                    <span class="category-badge">${getCategoryName(image.category)}</span>
                    <h5>${image.title}</h5>
                    <p>${image.description}</p>
                </div>
            `;
        }
        
        // Agregar evento de click
        galleryItem.addEventListener('click', () => openImageModal(image));
        
        col.appendChild(galleryItem);
        return col;
    }

    // Obtener imágenes filtradas
    function getFilteredImages() {
        if (currentFilter === 'all') {
            return allImages;
        }
        return allImages.filter(image => image.category === currentFilter);
    }

    // Obtener nombre de categoría
    function getCategoryName(category) {
        const categoryNames = {
            'instalaciones': 'Instalaciones',
            'produccion': 'Producción',
            'procesos': 'Procesos',
            'equipo': 'Equipo'
        };
        return categoryNames[category] || category;
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Filtros
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover clase active de todos los botones
                filterButtons.forEach(b => b.classList.remove('active'));
                // Agregar clase active al botón clickeado
                this.classList.add('active');
                
                // Actualizar filtro
                currentFilter = this.getAttribute('data-filter');
                displayedImages = 6; // Resetear contador
                renderGallery();
            });
        });

        // Botón de cargar más
        loadMoreBtn.addEventListener('click', function() {
            displayedImages += 6;
            renderGallery();
            
            // Scroll suave hacia las nuevas imágenes
            setTimeout(() => {
                const newImages = galleryContainer.querySelectorAll('.gallery-item:nth-last-child(-n+6)');
                if (newImages.length > 0) {
                    newImages[0].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }, 100);
        });

        // Botón de descarga
        downloadBtn.addEventListener('click', function() {
            const currentImage = getCurrentModalImage();
            if (currentImage && !currentImage.placeholder) {
                downloadImage(currentImage.src, currentImage.title);
            }
        });
    }

    // Abrir modal de imagen
    function openImageModal(image) {
        if (image.placeholder) {
            // No abrir modal para placeholders
            return;
        }

        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalTitle.textContent = image.title;
        modalDescription.textContent = image.description;
        
        // Actualizar botón de descarga
        downloadBtn.style.display = image.placeholder ? 'none' : 'inline-block';
        
        imageModal.show();
    }

    // Obtener imagen actual del modal
    function getCurrentModalImage() {
        const currentSrc = modalImage.src;
        return allImages.find(img => img.src === currentSrc);
    }

    // Descargar imagen
    function downloadImage(src, filename) {
        const link = document.createElement('a');
        link.href = src;
        link.download = filename.replace(/\s+/g, '_') + '.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Efecto de scroll en el navbar
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll para enlaces del navbar
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href;
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos de galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(el => {
        observer.observe(el);
    });

    // Lazy loading para imágenes
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    // Observar imágenes lazy
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Navegación por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (imageModal._isShown) {
                imageModal.hide();
            }
        }
    });

    // Inicializar la galería
    initGallery();
    
    console.log('Galería de Pisci-Mayas inicializada correctamente!');
});
