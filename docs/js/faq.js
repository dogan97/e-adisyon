/**
 * E-Adisyon - Sıkça Sorulan Sorular (FAQ) Fonksiyonları
 * Modern ve etkileşimli SSS sayfası için JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
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
    
    // Sayfa yüklendiğinde ilk soruyu otomatik aç (gerekirse)
    // const firstFaqCard = document.querySelector('.faq-card:first-child');
    // if (firstFaqCard) {
    //     firstFaqCard.classList.add('active');
    //     const firstAnswer = firstFaqCard.querySelector('.faq-answer');
    //     firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    // }
});
