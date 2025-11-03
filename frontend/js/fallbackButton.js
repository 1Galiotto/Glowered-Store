
    (function(){
      const backBtn = document.getElementById('backBtn');
      const fallback = './index.html'; // ajuste o fallback para a página desejada

      // 1) se a URL tem ?from=..., usa isso (ex: login.html?from=/produto.html)
    const qp = new URLSearchParams(location.search);

    const _fromCandidate = qp.get('from');
    const _prevCandidate = sessionStorage.getItem('prev');
    let _refCandidate = null;
    try {
        const _ref = document.referrer;
        if (_ref) {
            const _refUrl = new URL(_ref);
            if (_refUrl.origin === location.origin) _refCandidate = _ref;
        }
    } catch (e) { /* ignora */ }

    const _hasReturnTarget = Boolean(_fromCandidate || _prevCandidate || _refCandidate || history.length > 1);

    // mostra uma mensagem de erro se não houver para onde retornar (antes do handler principal executar)
    backBtn.addEventListener('click', function () {
        if (!_hasReturnTarget) {
            try {
                alert('Erro ao tentar retornar à página');
            } catch (e) {
                console.error('Erro ao tentar retornar à página');
            }
        }
    });     const fromParam = qp.get('from');

      // 2) sessionStorage prev (opcional: páginas de origem podem gravar sessionStorage.setItem('prev', location.href))
      const prevFromStorage = sessionStorage.getItem('prev');

      // 3) document.referrer seguro (mesma origem)
    const ref = document.referrer
      let refSameOrigin = null;
      try {
        if (ref) {
          const refUrl = new URL(ref);
          if (refUrl.origin === location.origin) refSameOrigin = ref;
        }
      } catch(e){ /* ignora */ }

      backBtn.addEventListener('click', function(e){
        e.preventDefault();

        if (fromParam) {
          location.href = fromParam;
          return;
        }

        if (prevFromStorage) {
          location.href = prevFromStorage;
          return;
        }

        if (refSameOrigin) {
          // redireciona para a página de onde veio (mesma origem)
          location.href = refSameOrigin;
          return;
        }

        // se o histórico permite, volta
        if (history.length > 1) {
          history.back();
          return;
        }

        // último recurso: fallback
        location.href = fallback;
      });

      // opcional: mostra/esconde o botão se não quiser exibi-lo quando não houver alvo
      // aqui deixamos sempre visível; para esconder faça: if (!fromParam && !refSameOrigin && history.length <= 1) backBtn.style.display = 'none';
    })();