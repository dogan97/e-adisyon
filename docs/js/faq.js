/**
 * E-Adisyon - Sıkça Sorulan Sorular (FAQ) Fonksiyonları
 * Modern ve etkileşimli SSS sayfası için JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tab değiştirme fonksiyonu
    const faqTabs = document.querySelectorAll('.faq-tab-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    // Tab'lar arası geçiş için event listener
    faqTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Aktif tab'ı değiştir
            faqTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Aktif kategoriyi değiştir
            faqCategories.forEach(cat => {
                if (cat.getAttribute('data-category') === category) {
                    cat.classList.add('active');
                } else {
                    cat.classList.remove('active');
                }
            });
        });
    });
    
    // Soru/Cevap toggle fonksiyonu
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqCard = question.closest('.faq-card');
            
            // Diğer açık soruları kapat
            document.querySelectorAll('.faq-card.active').forEach(card => {
                if (card !== faqCard) {
                    card.classList.remove('active');
                    const answer = card.querySelector('.faq-answer');
                    answer.style.maxHeight = '0';
                }
            });
            
            // Tıklanan soruyu aç/kapat
            faqCard.classList.toggle('active');
            
            // Yükseklik animasyonu için max-height ayarla
            const answer = faqCard.querySelector('.faq-answer');
            if (faqCard.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
    
    // Sayfa yüklendiğinde ilk soruyu otomatik aç
    const firstFaqCard = document.querySelector('.faq-category.active .faq-card:first-child');
    if (firstFaqCard) {
        firstFaqCard.classList.add('active');
        const firstAnswer = firstFaqCard.querySelector('.faq-answer');
        firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
    
    // URL'de hash değeri varsa, o tab'a git
    const hash = window.location.hash.substring(1);
    if (hash && hash.startsWith('faq-')) {
        const category = hash.replace('faq-', '');
        const targetTab = document.querySelector(`.faq-tab-btn[data-category="${category}"]`);
        if (targetTab) {
            targetTab.click();
            
            // Smooth scroll to FAQ section
            const faqSection = document.getElementById('sss');
            if (faqSection) {
                setTimeout(() => {
                    faqSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }
});
