// Meal prep: an optional planner. A short questionnaire (like a meal-kit sign-up) turns the cook's
// goals, schedule, budget and kitchen into cook days, batch servings, an eating calendar and a
// grocery list. Prices are rough per-serving averages, clearly labelled as estimates.
import React, { useContext, useMemo, useState } from "react";

const S = (en, es, fr, pt, hi, zh, ar) => ({ en, es, fr, pt, hi, zh, ar });

export const MP = {
  title: S("Meal prep", "Preparación de comidas", "Préparation des repas", "Marmitas da semana", "मील प्रेप", "备餐计划", "تحضير الوجبات"),
  sub: S("Plan meals, groceries and budget for a week, a month or any stretch you like.", "Planifica comidas, compras y presupuesto para una semana, un mes o el tiempo que quieras.", "Planifiez repas, courses et budget pour une semaine, un mois ou la durée de votre choix.", "Planeje refeições, compras e orçamento para uma semana, um mês ou o período que quiser.", "एक हफ़्ते, एक महीने या जितने दिन चाहें, उतने के लिए खाना, किराना और बजट प्लान करें।", "为一周、一个月或任意时间段规划餐食、采购和预算。", "خطّط لوجباتك ومشترياتك وميزانيتك لأسبوع أو شهر أو أي مدة تريدها."),
  moreSub: S("Optional: plan meals and groceries around your budget and schedule", "Opcional: planifica comidas y compras según tu presupuesto y horario", "Facultatif : planifiez repas et courses selon votre budget et votre emploi du temps", "Opcional: planeje refeições e compras de acordo com seu orçamento e sua rotina", "वैकल्पिक: अपने बजट और समय के हिसाब से खाना और किराना प्लान करें", "可选：按预算和时间安排规划餐食和采购", "اختياري: خطّط للوجبات والمشتريات حسب ميزانيتك ووقتك"),
  optional: S("Meal prep is optional. Use it when you want to plan ahead; everything else in the app works without it.", "La preparación de comidas es opcional. Úsala cuando quieras planificar; todo lo demás funciona sin ella.", "La préparation des repas est facultative. Utilisez-la quand vous voulez anticiper ; tout le reste fonctionne sans.", "As marmitas são opcionais. Use quando quiser se planejar; o resto do app funciona sem isso.", "मील प्रेप वैकल्पिक है। जब पहले से प्लान करना हो तब इस्तेमाल करें; ऐप का बाकी सब इसके बिना भी चलता है।", "备餐是可选功能。想提前规划时再用；应用的其他功能不受影响。", "تحضير الوجبات اختياري. استخدمه عندما تريد التخطيط مسبقًا؛ كل شيء آخر في التطبيق يعمل بدونه."),
  homeTitle: S("Want to plan ahead?", "¿Quieres planificar?", "Envie d'anticiper ?", "Quer se planejar?", "पहले से प्लान करना है?", "想提前规划吗？", "تريد التخطيط مسبقًا؟"),
  homeBody: S("Answer a few questions and Auntie Ceci builds a meal prep plan around your budget, time and what you already have.", "Responde unas preguntas y Auntie Ceci arma un plan de comidas según tu presupuesto, tu tiempo y lo que ya tienes.", "Répondez à quelques questions et Auntie Ceci crée un plan de repas selon votre budget, votre temps et ce que vous avez déjà.", "Responda algumas perguntas e a Auntie Ceci monta um plano de marmitas com base no seu orçamento, tempo e no que você já tem.", "कुछ सवालों के जवाब दें और Auntie Ceci आपके बजट, समय और घर में मौजूद चीज़ों के हिसाब से मील प्रेप प्लान बनाएगी।", "回答几个问题，Auntie Ceci 会根据你的预算、时间和现有食材制定备餐计划。", "أجب عن بضعة أسئلة وستضع Auntie Ceci خطة لتحضير الوجبات حسب ميزانيتك ووقتك وما لديك بالفعل."),
  homeCta: S("Plan my meals", "Planificar mis comidas", "Planifier mes repas", "Planejar minhas refeições", "मेरा खाना प्लान करें", "规划我的餐食", "خطّط وجباتي"),
  homeOpen: S("Open my meal plan", "Abrir mi plan", "Ouvrir mon plan", "Abrir meu plano", "मेरा प्लान खोलें", "打开我的计划", "افتح خطتي"),
  whyTitle: S("Why meal prep?", "¿Por qué preparar comidas?", "Pourquoi préparer ses repas ?", "Por que fazer marmitas?", "मील प्रेप क्यों?", "为什么要备餐？", "لماذا تحضير الوجبات؟"),
  start: S("Build my plan", "Crear mi plan", "Créer mon plan", "Montar meu plano", "मेरा प्लान बनाएं", "制定我的计划", "أنشئ خطتي"),
  next: S("Next", "Siguiente", "Suivant", "Próximo", "आगे", "下一步", "التالي"),
  back: S("Back", "Atrás", "Retour", "Voltar", "पीछे", "上一步", "رجوع"),
  stepOf: S("Step {n} of {total}", "Paso {n} de {total}", "Étape {n} sur {total}", "Passo {n} de {total}", "चरण {n} / {total}", "第 {n} 步，共 {total} 步", "الخطوة {n} من {total}"),
  pickAny: S("Pick all that apply.", "Elige todas las que quieras.", "Choisissez tout ce qui s'applique.", "Escolha quantas quiser.", "जो भी लागू हो, सब चुनें।", "可多选。", "اختر كل ما ينطبق."),
  q1: S("What do you want from meal prep?", "¿Qué buscas con la preparación de comidas?", "Qu'attendez-vous de la préparation des repas ?", "O que você quer com as marmitas?", "मील प्रेप से आप क्या चाहते हैं?", "你希望备餐帮你做到什么？", "ماذا تريد من تحضير الوجبات؟"),
  q2: S("What do you like to eat?", "¿Qué te gusta comer?", "Qu'aimez-vous manger ?", "O que você gosta de comer?", "आपको क्या खाना पसंद है?", "你喜欢吃什么？", "ماذا تحب أن تأكل؟"),
  q2hint: S("Pick any. The plan leans toward these. Vegetarian and vegan are kept strictly.", "Elige las que quieras. El plan se inclina hacia ellas. Vegetariano y vegano se respetan siempre.", "Choisissez librement. Le plan s'en inspire. Végétarien et végan sont toujours respectés.", "Escolha quantas quiser. O plano dá preferência a elas. Vegetariano e vegano são sempre respeitados.", "जो चाहें चुनें। प्लान इन्हीं की ओर झुकेगा। शाकाहारी और वीगन का पूरा पालन होता है।", "随意选择，计划会优先考虑。素食和纯素会严格遵守。", "اختر ما تشاء. تميل الخطة إليها. النباتي والنباتي الصرف يُلتزم بهما دائمًا."),
  q3: S("How many people are you cooking for?", "¿Para cuántas personas cocinas?", "Pour combien de personnes cuisinez-vous ?", "Para quantas pessoas você cozinha?", "आप कितने लोगों के लिए खाना बनाते हैं?", "你为几个人做饭？", "لكم شخصًا تطبخ؟"),
  q4: S("Which meals should the plan cover?", "¿Qué comidas debe cubrir el plan?", "Quels repas le plan doit-il couvrir ?", "Quais refeições o plano deve cobrir?", "प्लान में कौन-से खाने शामिल हों?", "计划要覆盖哪几餐？", "ما الوجبات التي يجب أن تشملها الخطة؟"),
  q5: S("How often can you cook?", "¿Con qué frecuencia puedes cocinar?", "À quelle fréquence pouvez-vous cuisiner ?", "Com que frequência você pode cozinhar?", "आप कितनी बार खाना बना सकते हैं?", "你多久能做一次饭？", "كم مرة يمكنك الطبخ؟"),
  timesWeek: S("times a week", "veces por semana", "fois par semaine", "vezes por semana", "बार हर हफ़्ते", "次 / 周", "مرات في الأسبوع"),
  sessionLen: S("How much time do you have each time you cook?", "¿Cuánto tiempo tienes cada vez que cocinas?", "Combien de temps avez-vous à chaque fois ?", "Quanto tempo você tem cada vez que cozinha?", "हर बार खाना बनाने के लिए कितना समय है?", "每次做饭有多少时间？", "كم من الوقت لديك في كل مرة تطبخ؟"),
  q6: S("How long should the plan run?", "¿Cuánto debe durar el plan?", "Sur quelle durée ?", "Por quanto tempo o plano deve durar?", "प्लान कितने दिन का हो?", "计划持续多久？", "ما مدة الخطة؟"),
  oneWeek: S("1 week", "1 semana", "1 semaine", "1 semana", "1 हफ़्ता", "1 周", "أسبوع واحد"),
  twoWeeks: S("2 weeks", "2 semanas", "2 semaines", "2 semanas", "2 हफ़्ते", "2 周", "أسبوعان"),
  month: S("1 month (4 weeks)", "1 mes (4 semanas)", "1 mois (4 semaines)", "1 mês (4 semanas)", "1 महीना (4 हफ़्ते)", "1 个月（4 周）", "شهر (4 أسابيع)"),
  custom: S("Custom", "Personalizado", "Personnalisé", "Personalizado", "अपने हिसाब से", "自定义", "مخصص"),
  daysLabel: S("days", "días", "jours", "dias", "दिन", "天", "أيام"),
  q7: S("What's your grocery budget?", "¿Cuál es tu presupuesto para compras?", "Quel est votre budget courses ?", "Qual é o seu orçamento de mercado?", "आपका किराना बजट कितना है?", "你的采购预算是多少？", "ما ميزانية مشترياتك؟"),
  q7hint: S("Leave it empty if you'd rather not set one.", "Déjalo vacío si prefieres no fijarlo.", "Laissez vide si vous préférez ne pas en fixer.", "Deixe vazio se preferir não definir.", "अगर बजट नहीं रखना है तो खाली छोड़ दें।", "不想设预算可以留空。", "اتركه فارغًا إن كنت لا تريد تحديد ميزانية."),
  perWeek: S("Per week", "Por semana", "Par semaine", "Por semana", "हर हफ़्ते", "每周", "في الأسبوع"),
  perPlan: S("For the whole plan", "Para todo el plan", "Pour tout le plan", "Para o plano todo", "पूरे प्लान के लिए", "整个计划", "للخطة كاملة"),
  useKitchen: S("Use what's already in my kitchen first", "Usar primero lo que ya tengo en la cocina", "Utiliser d'abord ce que j'ai déjà", "Usar primeiro o que já tenho na cozinha", "पहले रसोई में मौजूद चीज़ें इस्तेमाल करें", "优先用厨房里已有的食材", "استخدم ما في مطبخي أولًا"),
  summary: S("Your plan", "Tu plan", "Votre plan", "Seu plano", "आपका प्लान", "你的计划", "خطتك"),
  recipesWeek: S("Recipes per week", "Recetas por semana", "Recettes par semaine", "Receitas por semana", "हर हफ़्ते रेसिपी", "每周食谱", "وصفات في الأسبوع"),
  servingsWeek: S("Servings per week", "Porciones por semana", "Portions par semaine", "Porções por semana", "हर हफ़्ते सर्विंग", "每周份数", "حصص في الأسبوع"),
  cookDays: S("Cook days per week", "Días de cocina por semana", "Jours de cuisine par semaine", "Dias de cozinhar por semana", "हर हफ़्ते खाना बनाने के दिन", "每周做饭天数", "أيام الطبخ في الأسبوع"),
  perServing: S("Per serving (est.)", "Por porción (est.)", "Par portion (est.)", "Por porção (est.)", "प्रति सर्विंग (अनुमान)", "每份（估算）", "للحصة (تقديري)"),
  weekly: S("Groceries per week (est.)", "Compras por semana (est.)", "Courses par semaine (est.)", "Mercado por semana (est.)", "हर हफ़्ते किराना (अनुमान)", "每周采购（估算）", "المشتريات أسبوعيًا (تقديري)"),
  totalPlan: S("Whole plan (est.)", "Plan completo (est.)", "Plan complet (est.)", "Plano todo (est.)", "पूरा प्लान (अनुमान)", "整个计划（估算）", "الخطة كاملة (تقديري)"),
  budget: S("Budget", "Presupuesto", "Budget", "Orçamento", "बजट", "预算", "الميزانية"),
  within: S("Within budget", "Dentro del presupuesto", "Dans le budget", "Dentro do orçamento", "बजट के अंदर", "在预算内", "ضمن الميزانية"),
  over: S("About {x} over budget", "Unos {x} por encima del presupuesto", "Environ {x} au-dessus du budget", "Cerca de {x} acima do orçamento", "बजट से लगभग {x} ज़्यादा", "超出预算约 {x}", "أعلى من الميزانية بنحو {x}"),
  overTip: S("Try fewer people or meals, a longer budget, or swap pricier recipes.", "Prueba con menos personas o comidas, más presupuesto o cambia las recetas más caras.", "Essayez moins de personnes ou de repas, un budget plus large, ou changez les recettes plus chères.", "Tente menos pessoas ou refeições, um orçamento maior ou troque as receitas mais caras.", "कम लोग या खाने चुनें, बजट बढ़ाएं, या महंगी रेसिपी बदलें।", "可以减少人数或餐数、提高预算，或换掉较贵的食谱。", "جرّب عددًا أقل من الأشخاص أو الوجبات، أو ميزانية أكبر، أو بدّل الوصفات الأغلى."),
  estNote: S("Prices are rough averages to help you plan, not store prices. Things already in your kitchen count as free.", "Los precios son promedios aproximados para planificar, no precios de tienda. Lo que ya tienes cuenta como gratis.", "Les prix sont des moyennes approximatives pour planifier, pas des prix en magasin. Ce que vous avez déjà compte comme gratuit.", "Os preços são médias aproximadas para planejar, não preços de loja. O que você já tem conta como grátis.", "दाम अनुमानित औसत हैं, दुकान के असली दाम नहीं। रसोई में पहले से मौजूद चीज़ें मुफ़्त मानी गई हैं।", "价格是用于规划的粗略平均值，不是商店实价。厨房里已有的食材按免费计算。", "الأسعار متوسطات تقريبية للتخطيط وليست أسعار المتاجر. ما لديك بالفعل يُحسب مجانًا."),
  create: S("Create my plan", "Crear mi plan", "Créer mon plan", "Criar meu plano", "मेरा प्लान बनाएं", "生成我的计划", "أنشئ خطتي"),
  week: S("Week {n}", "Semana {n}", "Semaine {n}", "Semana {n}", "हफ़्ता {n}", "第 {n} 周", "الأسبوع {n}"),
  cookDay: S("Cook day", "Día de cocina", "Jour de cuisine", "Dia de cozinhar", "खाना बनाने का दिन", "做饭日", "يوم الطبخ"),
  about: S("about {n} min", "unos {n} min", "environ {n} min", "cerca de {n} min", "लगभग {n} मिनट", "约 {n} 分钟", "نحو {n} دقيقة"),
  makes: S("Makes {n} servings", "Rinde {n} porciones", "Donne {n} portions", "Rende {n} porções", "{n} सर्विंग बनेंगी", "做 {n} 份", "يكفي {n} حصص"),
  covers: S("Eat {from} to {to}", "Para comer del {from} al {to}", "À manger du {from} au {to}", "Para comer de {from} a {to}", "{from} से {to} तक खाएं", "{from} 至 {to} 吃", "للأكل من {from} إلى {to}"),
  coversOne: S("Eat on {from}", "Para comer el {from}", "À manger le {from}", "Para comer em {from}", "{from} को खाएं", "{from} 吃", "للأكل يوم {from}"),
  swap: S("Swap", "Cambiar", "Changer", "Trocar", "बदलें", "换一个", "استبدال"),
  cookIt: S("Cook it", "Cocinar", "Cuisiner", "Cozinhar", "बनाएं", "开始做", "اطبخها"),
  calendar: S("What you'll eat", "Lo que vas a comer", "Ce que vous allez manger", "O que você vai comer", "आप क्या खाएंगे", "每天吃什么", "ما ستأكله"),
  fresh: S("cook day", "día de cocina", "jour de cuisine", "dia de cozinhar", "बनाने का दिन", "做饭当天", "يوم الطبخ"),
  fridge: S("from the fridge", "de la nevera", "du frigo", "da geladeira", "फ्रिज से", "冷藏", "من الثلاجة"),
  freezer: S("from the freezer", "del congelador", "du congélateur", "do freezer", "फ्रीज़र से", "冷冻", "من المجمّد"),
  groceries: S("Grocery list", "Lista de compras", "Liste de courses", "Lista de compras", "किराना सूची", "采购清单", "قائمة المشتريات"),
  forServings: S("for {n} servings", "para {n} porciones", "pour {n} portions", "para {n} porções", "{n} सर्विंग के लिए", "够 {n} 份", "لـ {n} حصص"),
  staple: S("lasts many meals", "dura muchas comidas", "dure plusieurs repas", "dura várias refeições", "कई बार चलेगा", "可用很多次", "يكفي لوجبات كثيرة"),
  haveAlready: S("Already in your kitchen", "Ya está en tu cocina", "Déjà dans votre cuisine", "Já está na sua cozinha", "रसोई में पहले से है", "厨房里已有", "موجود في مطبخك"),
  addAll: S("Add {n} items to my shopping list", "Añadir {n} productos a mi lista", "Ajouter {n} articles à ma liste", "Adicionar {n} itens à minha lista", "{n} चीज़ें मेरी शॉपिंग सूची में जोड़ें", "把 {n} 样加入购物清单", "أضف {n} عناصر إلى قائمة التسوق"),
  added: S("Added to your shopping list", "Añadido a tu lista de compras", "Ajouté à votre liste de courses", "Adicionado à sua lista de compras", "शॉपिंग सूची में जोड़ दिया", "已加入购物清单", "أُضيف إلى قائمة التسوق"),
  nothingToBuy: S("You already have everything for this week.", "Ya tienes todo para esta semana.", "Vous avez déjà tout pour cette semaine.", "Você já tem tudo para esta semana.", "इस हफ़्ते के लिए आपके पास सब कुछ है।", "这周需要的你都有了。", "لديك كل شيء لهذا الأسبوع."),
  storageTitle: S("Keeping prepped food safe", "Cómo conservar la comida preparada", "Conserver les plats préparés", "Como guardar as marmitas", "पहले से बना खाना सुरक्षित रखना", "安全保存备好的饭菜", "حفظ الطعام المحضّر بأمان"),
  storageBody: S("Cool leftovers and get them into the fridge within 2 hours. Eat fridge portions within 3 to 4 days and freeze the rest. Thaw frozen portions in the fridge overnight and reheat until steaming hot.", "Enfría las sobras y guárdalas en la nevera antes de 2 horas. Come las porciones de la nevera en 3 a 4 días y congela el resto. Descongela en la nevera durante la noche y recalienta hasta que humee.", "Laissez refroidir et mettez au frigo dans les 2 heures. Mangez les portions du frigo en 3 à 4 jours et congelez le reste. Décongelez au frigo pendant la nuit et réchauffez jusqu'à ce que ce soit bien chaud.", "Esfrie as sobras e coloque na geladeira em até 2 horas. Coma as porções da geladeira em 3 a 4 dias e congele o resto. Descongele na geladeira durante a noite e reaqueça até sair vapor.", "बचा खाना ठंडा करके 2 घंटे के अंदर फ्रिज में रखें। फ्रिज वाला खाना 3 से 4 दिन में खा लें और बाकी फ्रीज़ कर दें। जमा हुआ खाना रात भर फ्रिज में पिघलाएं और भाप निकलने तक गर्म करें।", "剩菜放凉后 2 小时内放进冰箱。冷藏的份 3 到 4 天内吃完，其余冷冻。冷冻的份前一晚放冷藏室解冻，再加热到冒热气。", "برّد البقايا وضعها في الثلاجة خلال ساعتين. كُل حصص الثلاجة خلال 3 إلى 4 أيام وجمّد الباقي. أذب الحصص المجمّدة في الثلاجة طوال الليل وسخّنها حتى يتصاعد البخار."),
  edit: S("Change answers", "Cambiar respuestas", "Modifier les réponses", "Mudar respostas", "जवाब बदलें", "修改答案", "تغيير الإجابات"),
  remake: S("New plan", "Nuevo plan", "Nouveau plan", "Novo plano", "नया प्लान", "重新生成", "خطة جديدة"),
  remove: S("Delete plan", "Borrar plan", "Supprimer le plan", "Apagar plano", "प्लान हटाएं", "删除计划", "حذف الخطة"),
  relaxed: S("Not every recipe fits all your answers (time or tools), so a few limits were relaxed.", "No todas las recetas encajan con todas tus respuestas (tiempo o utensilios), así que se relajaron algunos límites.", "Toutes les recettes ne correspondent pas à toutes vos réponses (temps ou ustensiles) : quelques limites ont été assouplies.", "Nem toda receita se encaixa em todas as respostas (tempo ou utensílios), então alguns limites foram flexibilizados.", "हर रेसिपी आपके सभी जवाबों (समय या बर्तन) में फिट नहीं होती, इसलिए कुछ सीमाएं थोड़ी ढीली की गईं।", "并非每个食谱都符合你的全部条件（时间或厨具），所以放宽了一些限制。", "ليست كل الوصفات تناسب كل إجاباتك (الوقت أو الأدوات)، لذا خُففت بعض القيود."),
  noRecipes: S("No recipes match these answers. Try fewer limits.", "Ninguna receta coincide. Prueba con menos límites.", "Aucune recette ne correspond. Essayez avec moins de limites.", "Nenhuma receita combina. Tente com menos limites.", "इन जवाबों से कोई रेसिपी मेल नहीं खाती। कम शर्तें रखें।", "没有符合条件的食谱，试着少设一些限制。", "لا توجد وصفات مطابقة. جرّب قيودًا أقل."),
  adjustTitle: S("Adjust your plan", "Ajusta tu plan", "Ajustez votre plan", "Ajuste seu plano", "अपना प्लान बदलें", "调整你的计划", "عدّل خطتك"),
  adjustSub: S("Change anything here: servings, groceries, cost and calories all update together.", "Cambia lo que quieras: porciones, compras, costo y calorías se actualizan juntos.", "Modifiez ce que vous voulez : portions, courses, coût et calories se mettent à jour ensemble.", "Mude o que quiser: porções, compras, custo e calorias se atualizam juntos.", "यहां कुछ भी बदलें: सर्विंग, किराना, खर्च और कैलोरी सब साथ में बदलेंगे।", "随意调整：份数、采购、费用和热量会一起更新。", "غيّر ما تشاء: تتحدث الحصص والمشتريات والتكلفة والسعرات معًا."),
  repickNote: S("Changing these picks new recipes.", "Cambiar esto elige recetas nuevas.", "Modifier ceci choisit de nouvelles recettes.", "Mudar isto escolhe receitas novas.", "इन्हें बदलने पर नई रेसिपी चुनी जाएंगी।", "修改这些会重新挑选食谱。", "تغيير هذه يختار وصفات جديدة."),
  nutrTitle: S("Daily calories", "Calorías diarias", "Calories par jour", "Calorias por dia", "रोज़ की कैलोरी", "每日热量", "السعرات اليومية"),
  dailyGoal: S("Your daily goal", "Tu meta diaria", "Votre objectif quotidien", "Sua meta diária", "आपका रोज़ का लक्ष्य", "你的每日目标", "هدفك اليومي"),
  fromGoals: S("from your Nutrition goals", "de tus metas de nutrición", "d'après vos objectifs nutritionnels", "das suas metas de nutrição", "आपके पोषण लक्ष्यों से", "来自你的营养目标", "من أهدافك الغذائية"),
  typical: S("a typical adult estimate; set yours in Nutrition goals", "una estimación típica para adultos; fija la tuya en Metas de nutrición", "une estimation adulte typique ; fixez la vôtre dans Objectifs nutritionnels", "uma estimativa típica de adulto; defina a sua em Metas de nutrição", "आम वयस्क का अनुमान; अपना लक्ष्य पोषण लक्ष्य में सेट करें", "成人常见估算；可在营养目标里设置你自己的", "تقدير معتاد للبالغين؛ حدّد هدفك في الأهداف الغذائية"),
  coverShare: S("The planned meals cover about {p}% of a day, so the plan aims for about {n} kcal.", "Las comidas planificadas cubren cerca del {p}% del día, así que el plan apunta a unas {n} kcal.", "Les repas prévus couvrent environ {p} % de la journée : le plan vise environ {n} kcal.", "As refeições planejadas cobrem cerca de {p}% do dia, então o plano mira em umas {n} kcal.", "प्लान वाले खाने दिन का लगभग {p}% हिस्सा हैं, इसलिए प्लान लगभग {n} kcal का लक्ष्य रखता है।", "计划内的餐约占一天的 {p}%，所以计划目标约为 {n} 千卡。", "تغطي الوجبات المخططة نحو {p}% من اليوم، لذا تستهدف الخطة نحو {n} سعرة."),
  planGives: S("This plan gives about {n} kcal a day per person", "Este plan da unas {n} kcal al día por persona", "Ce plan apporte environ {n} kcal par jour et par personne", "Este plano dá cerca de {n} kcal por dia por pessoa", "यह प्लान हर व्यक्ति को रोज़ लगभग {n} kcal देता है", "此计划每人每天约 {n} 千卡", "تقدّم هذه الخطة نحو {n} سعرة يوميًا للشخص"),
  range: S("{a}–{b} depending on the day", "{a}–{b} según el día", "{a}–{b} selon le jour", "{a}–{b} dependendo do dia", "दिन के हिसाब से {a}–{b}", "视日子在 {a}–{b} 之间", "{a}–{b} حسب اليوم"),
  portion: S("Portion size", "Tamaño de la porción", "Taille des portions", "Tamanho da porção", "हिस्से का आकार", "份量", "حجم الحصة"),
  onTarget: S("On target", "En tu meta", "Dans l'objectif", "Na meta", "लक्ष्य पर", "符合目标", "ضمن الهدف"),
  underBy: S("About {n} kcal under", "Unas {n} kcal por debajo", "Environ {n} kcal en dessous", "Cerca de {n} kcal abaixo", "लगभग {n} kcal कम", "约少 {n} 千卡", "أقل بنحو {n} سعرة"),
  overBy: S("About {n} kcal over", "Unas {n} kcal por encima", "Environ {n} kcal au-dessus", "Cerca de {n} kcal acima", "लगभग {n} kcal ज़्यादा", "约多 {n} 千卡", "أكثر بنحو {n} سعرة"),
  clampHi: S("Portions stop at ×2.5. Add a meal or snack to get closer.", "Las porciones llegan hasta ×2.5. Añade una comida o merienda para acercarte.", "Les portions s'arrêtent à ×2,5. Ajoutez un repas ou une collation pour vous rapprocher.", "As porções vão até ×2,5. Adicione uma refeição ou lanche para chegar mais perto.", "हिस्सा ×2.5 से ज़्यादा नहीं होता। करीब पहुंचने के लिए एक खाना या स्नैक जोड़ें।", "份量最多 ×2.5。加一餐或零食会更接近目标。", "الحصص تتوقف عند ×2.5. أضف وجبة أو وجبة خفيفة لتقترب."),
  clampLo: S("Portions stop at ×0.5. Plan fewer meals to get closer.", "Las porciones bajan hasta ×0.5. Planifica menos comidas para acercarte.", "Les portions s'arrêtent à ×0,5. Prévoyez moins de repas pour vous rapprocher.", "As porções vão até ×0,5. Planeje menos refeições para chegar mais perto.", "हिस्सा ×0.5 से कम नहीं होता। करीब पहुंचने के लिए कम खाने प्लान करें।", "份量最少 ×0.5。少规划几餐会更接近目标。", "الحصص لا تقل عن ×0.5. خطّط لوجبات أقل لتقترب."),
  macrosLine: S("Protein {p} g · Carbs {c} g · Fat {f} g a day", "Proteína {p} g · Carbohidratos {c} g · Grasa {f} g al día", "Protéines {p} g · Glucides {c} g · Lipides {f} g par jour", "Proteína {p} g · Carboidratos {c} g · Gordura {f} g por dia", "रोज़ प्रोटीन {p} g · कार्ब्स {c} g · फ़ैट {f} g", "每天蛋白质 {p} g · 碳水 {c} g · 脂肪 {f} g", "يوميًا: بروتين {p} غ · كربوهيدرات {c} غ · دهون {f} غ"),
  nutrNote: S("Calories come from each recipe's nutrition estimate. A rough guide, not medical advice.", "Las calorías salen de la estimación nutricional de cada receta. Es una guía aproximada, no consejo médico.", "Les calories viennent de l'estimation nutritionnelle de chaque recette. Un repère approximatif, pas un avis médical.", "As calorias vêm da estimativa nutricional de cada receita. É um guia aproximado, não orientação médica.", "कैलोरी हर रेसिपी के पोषण अनुमान से है। यह मोटा अंदाज़ा है, डॉक्टरी सलाह नहीं।", "热量来自每个食谱的营养估算，仅供粗略参考，不是医疗建议。", "السعرات مأخوذة من تقدير تغذية كل وصفة. دليل تقريبي وليس نصيحة طبية."),
  peopleShort: S("People", "Personas", "Personnes", "Pessoas", "लोग", "人数", "الأشخاص"),
  mealsShort: S("Meals", "Comidas", "Repas", "Refeições", "खाने", "餐次", "الوجبات"),
  cooksShort: S("Cook days a week", "Días de cocina por semana", "Jours de cuisine par semaine", "Dias de cozinhar por semana", "हफ़्ते में बनाने के दिन", "每周做饭天数", "أيام الطبخ في الأسبوع"),
  sessionShort: S("Time each cook day", "Tiempo por día de cocina", "Temps par jour de cuisine", "Tempo por dia de cozinhar", "हर बार का समय", "每次做饭时间", "الوقت في كل يوم طبخ"),
  lengthShort: S("Plan length", "Duración del plan", "Durée du plan", "Duração do plano", "प्लान की अवधि", "计划时长", "مدة الخطة"),
  prefsShort: S("Food preferences", "Preferencias", "Préférences", "Preferências", "पसंद", "饮食偏好", "التفضيلات"),
  perPersonDay: S("per person", "por persona", "par personne", "por pessoa", "प्रति व्यक्ति", "每人", "للشخص"),
  person: S("person", "persona", "personne", "pessoa", "व्यक्ति", "人", "شخص"),
  people: S("people", "personas", "personnes", "pessoas", "लोग", "人", "أشخاص"),
};

// Reasons, food preferences and session lengths offered in the questionnaire.
export const MP_REASONS = [
  { id: "money", emoji: "💰", label: S("Save money", "Ahorrar dinero", "Économiser", "Economizar", "पैसे बचाना", "省钱", "توفير المال"), why: S("Buy only what the plan needs and use up what you have.", "Compra solo lo que el plan necesita y aprovecha lo que tienes.", "N'achetez que ce dont le plan a besoin et utilisez ce que vous avez.", "Compre só o que o plano precisa e use o que já tem.", "सिर्फ़ वही खरीदें जो प्लान में चाहिए और जो है उसे इस्तेमाल करें।", "只买计划需要的，用完已有的。", "اشترِ ما تحتاجه الخطة فقط واستخدم ما لديك.") },
  { id: "time", emoji: "⏱️", label: S("Save time", "Ahorrar tiempo", "Gagner du temps", "Ganhar tempo", "समय बचाना", "省时间", "توفير الوقت"), why: S("Cook once or twice, eat all week.", "Cocina una o dos veces y come toda la semana.", "Cuisinez une ou deux fois, mangez toute la semaine.", "Cozinhe uma ou duas vezes e coma a semana toda.", "एक-दो बार बनाएं, पूरे हफ़्ते खाएं।", "做一两次，吃一整周。", "اطبخ مرة أو مرتين وكُل طوال الأسبوع.") },
  { id: "healthy", emoji: "🥗", label: S("Eat healthier", "Comer más sano", "Manger plus sainement", "Comer melhor", "सेहतमंद खाना", "吃得更健康", "أكل صحي أكثر"), why: S("A ready meal beats last-minute takeout.", "Una comida lista gana a pedir a última hora.", "Un plat prêt vaut mieux qu'une commande de dernière minute.", "Uma refeição pronta é melhor que delivery de última hora.", "तैयार खाना आखिरी समय के टेकआउट से बेहतर है।", "现成的饭菜胜过临时叫外卖。", "الوجبة الجاهزة أفضل من الطلب في آخر لحظة.") },
  { id: "waste", emoji: "♻️", label: S("Waste less food", "Desperdiciar menos", "Moins gaspiller", "Desperdiçar menos", "कम बर्बादी", "减少浪费", "هدر أقل للطعام"), why: S("Ingredients get used across several meals.", "Los ingredientes se usan en varias comidas.", "Les ingrédients servent dans plusieurs repas.", "Os ingredientes são usados em várias refeições.", "सामग्री कई खानों में काम आती है।", "食材可以用在好几顿饭里。", "تُستخدم المكونات في عدة وجبات.") },
  { id: "stress", emoji: "🧠", label: S("Fewer decisions", "Menos decisiones", "Moins de décisions", "Menos decisões", "कम फ़ैसले", "少做决定", "قرارات أقل"), why: S("No more \"what's for dinner?\" every night.", "Se acabó el \"¿qué cenamos?\" cada noche.", "Fini le « on mange quoi ? » tous les soirs.", "Chega de \"o que tem pra janta?\" toda noite.", "हर रात \"आज क्या बनेगा?\" की चिंता खत्म।", "不用每晚纠结“吃什么”。", "لا مزيد من \"ماذا نأكل الليلة؟\" كل مساء.") },
  { id: "learn", emoji: "👩‍🍳", label: S("Learn to cook", "Aprender a cocinar", "Apprendre à cuisiner", "Aprender a cozinhar", "खाना बनाना सीखना", "学做饭", "تعلّم الطبخ"), why: S("Repeat a few recipes and get confident fast.", "Repite unas recetas y gana confianza rápido.", "Répétez quelques recettes et prenez vite confiance.", "Repita algumas receitas e ganhe confiança rápido.", "कुछ रेसिपी दोहराएं और जल्दी आत्मविश्वास पाएं।", "反复做几道菜，很快就有信心。", "كرّر بضع وصفات واكتسب الثقة بسرعة.") },
];

export const MP_PREFS = [
  { id: "meat-veg", emoji: "🍗", label: S("Meat & veggies", "Carne y verduras", "Viande et légumes", "Carne e legumes", "मांस और सब्ज़ियां", "肉和蔬菜", "لحوم وخضار") },
  { id: "vegetarian", emoji: "🌱", label: S("Vegetarian", "Vegetariano", "Végétarien", "Vegetariano", "शाकाहारी", "素食", "نباتي") },
  { id: "vegan", emoji: "🌿", label: S("Vegan", "Vegano", "Végan", "Vegano", "वीगन", "纯素", "نباتي صرف") },
  { id: "high-protein", emoji: "💪", label: S("High protein", "Alto en proteína", "Riche en protéines", "Rico em proteína", "हाई प्रोटीन", "高蛋白", "غني بالبروتين") },
  { id: "quick-easy", emoji: "⚡", label: S("Quick & easy", "Rápido y fácil", "Rapide et facile", "Rápido e fácil", "जल्दी और आसान", "快手简单", "سريع وسهل") },
  { id: "budget-friendly", emoji: "💵", label: S("Budget friendly", "Económico", "Petit budget", "Econômico", "किफ़ायती", "省钱", "اقتصادي") },
  { id: "healthy-balanced", emoji: "🥑", label: S("Fit & wholesome", "Sano y equilibrado", "Sain et équilibré", "Saudável e equilibrado", "फिट और पौष्टिक", "健康均衡", "صحي ومتوازن") },
  { id: "low-carb", emoji: "🥩", label: S("Low carb", "Bajo en carbohidratos", "Faible en glucides", "Low carb", "लो कार्ब", "低碳水", "قليل الكربوهيدرات") },
];

const SESSION_OPTS = [20, 45, 90, 150];
const LENGTHS = [{ id: "1w", days: 7, key: "oneWeek" }, { id: "2w", days: 14, key: "twoWeeks" }, { id: "4w", days: 28, key: "month" }, { id: "custom", days: 0, key: "custom" }];

export const DEFAULT_ANSWERS = { reasons: [], prefs: [], people: 1, meals: ["lunch", "dinner"], sessions: 2, sessionMin: 45, length: "1w", days: 10, budget: "", budgetPer: "week", useKitchen: true, dailyCal: null, portion: 1, portionMode: "auto" };

// ---------- Rough prices (CAD) ----------
// Staples last many meals: counted once per plan if you don't have them. Everything else is per serving.
const STAPLE = {
  salt: 2, pepper: 3, oil: 6, "olive oil": 9, flour: 4, sugar: 3, "brown sugar": 3, "baking powder": 3, "baking soda": 2, cornstarch: 3,
  "soy sauce": 4, "garlic powder": 3, paprika: 3, cinnamon: 3, "curry powder": 4, cumin: 3, "chili powder": 3, "chili flakes": 3, spices: 4,
  vinegar: 3, "balsamic vinegar": 6, "sesame oil": 6, honey: 6, "maple syrup": 8, vanilla: 6, yeast: 3, "cocoa powder": 5, ketchup: 4, mayo: 5,
  mustard: 3, "hoisin sauce": 4, "sesame seeds": 4, "taco seasoning": 2, "jerk seasoning": 4, "berbere spice": 6, gochujang: 7, "miso paste": 6,
  "chili oil": 5, "chili bean paste": 5, "green curry paste": 5, "tomato paste": 2, "palm oil": 7, butter: 6, herbs: 3, nori: 5, seaweed: 5,
  breadcrumbs: 3, "caesar dressing": 4, salsa: 4, "marinara sauce": 4, "peanut butter": 5, jam: 4, "chocolate sprinkles": 4, "coconut flakes": 4,
  "chia seeds": 6, raisins: 4, "red bean paste": 5, "cassava flour": 5, "chickpea flour": 4, "tapioca flour": 4, cornmeal: 3,
};
const PER_SERVING = {
  "chicken breast": 2.8, "chicken thighs": 2.2, beef: 3.5, "ground beef": 2.5, steak: 5, "beef strips": 3.5, pork: 2.5, "pork chops": 2.5,
  "pork belly": 3, "ground pork": 2.2, "ground turkey": 2.5, "ground chicken": 2.5, "chicken wings": 2.5, bacon: 1.5, sausage: 1.8, ham: 1.5,
  "duck breast": 6, snails: 4, shrimp: 3.5, "salmon fillet": 5, cod: 4, tilapia: 3, "canned tuna": 1.5, eggs: 0.6, egg: 0.6,
  milk: 0.4, cheese: 0.9, cream: 0.7, mozzarella: 1, parmesan: 0.9, yogurt: 0.7, "greek yogurt": 0.9, feta: 1, "feta cheese": 1, ricotta: 1,
  paneer: 2, "whipped cream": 0.6, "condensed milk": 0.8, rice: 0.3, pasta: 0.4, bread: 0.4, tortilla: 0.5, oats: 0.3, "egg noodles": 0.6,
  "rice noodles": 0.6, "instant ramen": 0.8, "pita bread": 0.6, bulgur: 0.4, lentils: 0.4, "red lentils": 0.4, granola: 0.8,
  "empanada dough": 1.2, "puff pastry": 1.5, "spring roll wrappers": 0.6, "rice paper": 0.5, "dumpling wrappers": 0.8, "pound cake": 1.2, meringue: 1,
  "canned tomatoes": 0.6, "canned chickpeas": 0.6, "canned kidney beans": 0.6, "canned black beans": 0.6, "coconut milk": 1, "chicken broth": 0.5,
  "vegetable broth": 0.5, "beef broth": 0.5, "black-eyed peas": 0.6, "hearts of palm": 1.5, olives: 0.8, pickles: 0.5, corn: 0.5,
  "mixed vegetables": 0.7, peas: 0.5, onion: 0.3, garlic: 0.2, tomato: 0.6, potato: 0.4, "bell pepper": 0.9, lime: 0.4, lemon: 0.5, carrot: 0.3,
  "green onion": 0.3, banana: 0.3, cabbage: 0.5, apple: 0.6, strawberries: 1.2, lettuce: 0.7, cucumber: 0.6, mango: 1, pineapple: 1, ginger: 0.3,
  berries: 1.5, blueberries: 1.5, avocado: 1.2, spinach: 0.8, "sweet potato": 0.6, plantain: 0.6, cassava: 0.7, "scotch bonnet": 0.3, eggplant: 0.9,
  zucchini: 0.7, cauliflower: 0.9, broccoli: 0.9, "cherry tomatoes": 1, asparagus: 1.5, kiwi: 0.6, basil: 0.6, "thai basil": 0.8, "bean sprouts": 0.5,
  "red onion": 0.4, mushrooms: 1, leek: 0.8, celery: 0.4, kale: 0.8, "brussels sprouts": 1, "green beans": 0.8, "butternut squash": 0.8, beet: 0.5,
  lemongrass: 0.5, grapes: 1, "frozen berries": 1.2, peaches: 1, cilantro: 0.4, "jalapeño": 0.3, orange: 0.6, watermelon: 1, mint: 0.5, pears: 0.8,
  parsley: 0.4, romaine: 0.7, dates: 1, "green banana": 0.6, acai: 2.5, "orange juice": 0.6, "egusi seeds": 1.5, tofu: 1, peanuts: 0.5,
  almonds: 0.8, walnuts: 0.8, kimchi: 1, beer: 1.5, "chocolate chips": 0.6, hummus: 0.8,
};
const DEFAULT_PRICE = 0.8;
const isStaple = (name) => Object.prototype.hasOwnProperty.call(STAPLE, name);
export const servingPrice = (name) => (isStaple(name) ? 0.1 : PER_SERVING[name] ?? DEFAULT_PRICE);

// Approximate CAD exchange rates for the shopping countries, only to show estimates in local money.
const MONEY = { ca: ["CAD", 1], us: ["USD", 0.72], gb: ["GBP", 0.55], au: ["AUD", 1.1], nz: ["NZD", 1.22], ie: ["EUR", 0.63], de: ["EUR", 0.63], fr: ["EUR", 0.63], in: ["INR", 60], mx: ["MXN", 13] };
const LOCALES = { en: "en-CA", es: "es", fr: "fr-CA", pt: "pt-BR", hi: "hi-IN", zh: "zh-CN", ar: "ar" };
export function moneyFormatter(country, language) {
  const [code, rate] = MONEY[country] || MONEY.ca;
  let fmt;
  try { fmt = new Intl.NumberFormat(LOCALES[language] || "en-CA", { style: "currency", currency: code, maximumFractionDigits: code === "INR" || code === "MXN" ? 0 : 2 }); } catch { fmt = null; }
  return {
    rate,
    code,
    // CAD amount in, local money string out.
    fmt: (cad) => (fmt ? fmt.format(cad * rate) : `${(cad * rate).toFixed(2)} ${code}`),
    symbol: (() => { try { return fmt.formatToParts(0).find((p) => p.type === "currency").value; } catch { return code; } })(),
  };
}

export function recipeMinutes(recipe) {
  const s = String(recipe.time || "").toLowerCase();
  const h = s.match(/(\d+(?:\.\d+)?)\s*(h|hr|hour)/);
  const m = s.match(/(\d+)\s*(?:-|–\s*\d+\s*)?\s*m/);
  const total = (h ? parseFloat(h[1]) * 60 : 0) + (m ? parseInt(m[1], 10) : 0);
  if (total > 0) return total;
  const n = s.match(/\d+/);
  return n ? parseInt(n[0], 10) : 30;
}

// Small seeded random so a plan is stable and "swap" can move to the next option.
function rng(seed) {
  let x = (seed >>> 0) || 1;
  return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; };
}

export const planDays = (a) => (a.length === "custom" ? Math.max(3, Math.min(31, parseInt(a.days, 10) || 7)) : (LENGTHS.find((l) => l.id === a.length) || LENGTHS[0]).days);

// Rough share of a day's calories each meal usually provides.
const MEAL_SHARE = { breakfast: 0.25, lunch: 0.3, dinner: 0.35, snack: 0.1 };
export const mealShare = (meals) => Math.min(1, (meals.length ? meals : ["dinner"]).reduce((s, m) => s + (MEAL_SHARE[m] || 0.25), 0));
const calOf = (r) => (r && r.macros && Number(r.macros.calories)) || 0;
const roundTo = (n, step) => Math.round(n / step) * step;
export const PORTION_MIN = 0.5, PORTION_MAX = 2.5;

// Calories and macros per person per day at a portion size of 1, for every day of the plan.
export function planNutrition(plan, byId) {
  const days = planDays(plan.answers);
  const perDay = Array.from({ length: days }, () => ({ cal: 0, p: 0, c: 0, f: 0 }));
  for (const wk of plan.weeks) for (const s of wk.sessions) for (const it of s.items) {
    const r = byId(it.recipeId);
    if (!r) continue;
    const m = r.macros || {};
    for (let d = s.start; d < s.start + s.len && d < days; d++) {
      perDay[d].cal += Number(m.calories) || 0; perDay[d].p += Number(m.protein) || 0; perDay[d].c += Number(m.carbs) || 0; perDay[d].f += Number(m.fat) || 0;
    }
  }
  const avg = (k) => perDay.reduce((s, d) => s + d[k], 0) / (perDay.length || 1);
  const cals = perDay.map((d) => d.cal);
  return { perDay, cal: avg("cal"), p: avg("p"), c: avg("c"), f: avg("f"), min: Math.min(...cals), max: Math.max(...cals) };
}

// Ties everything together: portion size (from the calorie goal, unless set by hand) → servings.
export function finalizePlan(plan, byId) {
  const a = plan.answers;
  const base = planNutrition(plan, byId).cal;
  const target = (a.dailyCal || 2000) * mealShare(a.meals);
  let portion = a.portion || 1;
  let clamp = null;
  if (a.portionMode !== "manual" && base > 0) {
    const raw = target / base;
    portion = Math.min(PORTION_MAX, Math.max(PORTION_MIN, roundTo(raw, 0.25)));
    if (raw > PORTION_MAX + 0.12) clamp = "hi"; else if (raw < PORTION_MIN - 0.12) clamp = "lo";
  }
  const weeks = plan.weeks.map((wk) => ({ sessions: wk.sessions.map((s) => ({ ...s, items: s.items.map((it) => ({ ...it, servings: Math.max(1, Math.ceil(a.people * s.len * portion)) })) })) }));
  return { ...plan, weeks, portion, clamp };
}

function weeklyBudgetCad(a, rate) {
  const amt = parseFloat(String(a.budget).replace(",", "."));
  if (!(amt > 0)) return null;
  const local = a.budgetPer === "plan" ? (amt * 7) / planDays(a) : amt;
  return local / rate;
}

// ---------- Plan builder ----------
// ctx: { recipes, matchInfo, allergiesFor, owned(name) -> bool, rate }
function candidatesFor(meal, a, ctx) {
  return ctx.recipes.filter((r) => {
    if (!(r.mealTime || []).includes(meal)) return false;
    if (ctx.allergiesFor(r).length) return false;
    const cats = r.categories || [];
    if (a.prefs.includes("vegan") && !cats.includes("vegan")) return false;
    if (a.prefs.includes("vegetarian") && !cats.includes("vegetarian") && !cats.includes("vegan")) return false;
    return true;
  });
}

function scoreRecipe(r, a, ctx, opts) {
  const cats = r.categories || [];
  const info = ctx.matchInfo(r);
  let s = opts.rand() * 2.5;
  if (!info.haveEquip) s -= 6;
  if (cats.includes("meal-prep")) s += 3;
  for (const p of a.prefs) {
    if (p === "meat-veg") { if (!cats.includes("vegetarian") && !cats.includes("vegan")) s += 1.5; }
    else if (cats.includes(p)) s += 2;
  }
  if (a.reasons.includes("money") && cats.includes("budget-friendly")) s += 2;
  if (a.reasons.includes("time") && cats.includes("quick-easy")) s += 1.5;
  if (a.reasons.includes("healthy") && (cats.includes("healthy-balanced") || cats.includes("high-fiber") || cats.includes("low-calorie"))) s += 1.5;
  if (a.reasons.includes("learn") && cats.includes("beginner-friendly")) s += 1.5;
  if (a.reasons.includes("waste")) s += 0.7 * r.ingredients.filter((i) => !isStaple(i) && opts.weekIngredients.has(i)).length;
  if (a.useKitchen) {
    s += 0.6 * r.ingredients.filter((i) => !isStaple(i) && ctx.owned(i)).length;
    s -= 0.25 * info.missingIngredients.length;
  }
  if (recipeMinutes(r) > opts.maxMinutes) s -= 4;
  if (opts.targetCad != null) {
    const c = recipeServingCost(r, ctx);
    if (c > opts.targetCad) s -= (c - opts.targetCad) * 3;
  }
  if (opts.usedBefore.has(r.id)) s -= 2;
  // Lean toward recipes whose normal serving is near this meal's share of the daily goal.
  if (opts.mealTarget && calOf(r)) s -= Math.min(3, Math.abs(calOf(r) - opts.mealTarget) / 250);
  // Variety within a week: avoid near-duplicates (same cuisine, or two main ingredients in common).
  const mains = r.ingredients.filter((i) => !isStaple(i));
  for (const other of opts.weekPicks || []) {
    if (other.cuisine && other.cuisine === r.cuisine) s -= 0.8;
    const shared = mains.filter((i) => other.ingredients.includes(i)).length;
    if (shared >= 2 && !a.reasons.includes("waste")) s -= 1.5;
    if (other.name && r.name && other.name.split(" ").slice(-2).join(" ") === r.name.split(" ").slice(-2).join(" ")) s -= 3;
  }
  return s;
}

export function recipeServingCost(r, ctx) {
  return r.ingredients.reduce((sum, i) => sum + (ctx.owned(i) ? 0 : servingPrice(i)), 0);
}

// Spread cook sessions over the days of a week; each session feeds the days until the next one.
function sessionDays(daysInWeek, sessions) {
  const n = Math.max(1, Math.min(sessions, daysInWeek));
  const starts = Array.from({ length: n }, (_, i) => Math.floor((i * daysInWeek) / n));
  return starts.map((start, i) => ({ start, len: (starts[i + 1] ?? daysInWeek) - start }));
}

export function buildPlan(a, ctx, seed = Date.now()) {
  const rand = rng(seed);
  const days = planDays(a);
  const weeks = Math.ceil(days / 7);
  const meals = a.meals.length ? a.meals : ["dinner"];
  const maxMinutes = Math.max(10, Math.round(a.sessionMin / meals.length));
  const wb = weeklyBudgetCad(a, ctx.rate);
  const servingsPerWeek = a.people * meals.length * 7;
  const targetCad = wb != null ? wb / servingsPerWeek : null;
  let relaxed = false;
  const usedBefore = new Set();
  const out = [];
  for (let w = 0; w < weeks; w++) {
    const dw = Math.min(7, days - w * 7);
    const usedThisWeek = new Set();
    const weekIngredients = new Set();
    const weekPicks = [];
    const sessions = sessionDays(dw, a.sessions).map(({ start, len }) => {
      const items = meals.map((meal) => {
        const pool = candidatesFor(meal, a, ctx).filter((r) => !usedThisWeek.has(r.id));
        const mealTarget = (a.dailyCal || 2000) * (MEAL_SHARE[meal] || 0.25);
        const scored = pool.map((r) => ({ r, s: scoreRecipe(r, a, ctx, { rand, maxMinutes, targetCad, usedBefore, weekIngredients, weekPicks, mealTarget }) })).sort((x, y) => y.s - x.s);
        const pick = scored[0] && scored[0].r;
        if (!pick) return { meal, recipeId: null, servings: 0 };
        if (recipeMinutes(pick) > maxMinutes || !ctx.matchInfo(pick).haveEquip) relaxed = true;
        usedThisWeek.add(pick.id);
        weekPicks.push(pick);
        pick.ingredients.forEach((i) => weekIngredients.add(i));
        return { meal, recipeId: pick.id, servings: a.people * len };
      });
      return { start: w * 7 + start, len, items };
    });
    usedThisWeek.forEach((id) => usedBefore.add(id));
    out.push({ sessions });
  }
  return finalizePlan({ answers: a, seed, startDate: todayIso(), weeks: out, relaxed }, ctx.byId);
}

// Next best recipe for one slot, skipping recipes already used that week.
export function swapPick(plan, w, si, ii, ctx) {
  const a = plan.answers;
  const week = plan.weeks[w];
  const item = week.sessions[si].items[ii];
  const used = new Set(week.sessions.flatMap((s) => s.items.map((x) => x.recipeId)));
  const tried = new Set([...(item.tried || []), item.recipeId]);
  const meals = a.meals.length ? a.meals : ["dinner"];
  const rand = rng((plan.seed || 1) + w * 97 + si * 13 + ii * 7 + tried.size * 31);
  const wb = weeklyBudgetCad(a, ctx.rate);
  const targetCad = wb != null ? wb / (a.people * meals.length * 7) : null;
  const pool = candidatesFor(item.meal, a, ctx).filter((r) => !used.has(r.id) && !tried.has(r.id));
  const weekPicks = week.sessions.flatMap((s, sj) => s.items.filter((x, ij) => !(sj === si && ij === ii)).map((x) => ctx.byId(x.recipeId))).filter(Boolean);
  const opts = { rand, maxMinutes: Math.max(10, Math.round(a.sessionMin / meals.length)), targetCad, usedBefore: new Set(), weekIngredients: new Set(), weekPicks, mealTarget: (a.dailyCal || 2000) * (MEAL_SHARE[item.meal] || 0.25) };
  let best = pool.map((r) => ({ r, s: scoreRecipe(r, a, ctx, opts) })).sort((x, y) => y.s - x.s)[0];
  let nextTried = [...tried];
  if (!best) { // went through them all: start over from the full list
    const again = candidatesFor(item.meal, a, ctx).filter((r) => !used.has(r.id));
    best = again.map((r) => ({ r, s: scoreRecipe(r, a, ctx, opts) })).sort((x, y) => y.s - x.s)[0];
    nextTried = [item.recipeId];
  }
  if (!best) return plan;
  const weeks = plan.weeks.map((wk, wi) => wi !== w ? wk : {
    sessions: wk.sessions.map((s, sj) => sj !== si ? s : { ...s, items: s.items.map((x, ij) => ij !== ii ? x : { ...x, recipeId: best.r.id, tried: nextTried }) }),
  });
  return finalizePlan({ ...plan, weeks }, ctx.byId);
}

const newSeed = () => Math.floor(Math.random() * 1e9) + 1;

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function dayDate(startIso, offset) {
  const [y, m, d] = String(startIso || todayIso()).split("-").map(Number);
  return new Date(y, m - 1, d + offset);
}

// Groceries and cost for a set of plan weeks.
export function groceriesFor(weeks, ctx) {
  const map = new Map();
  let total = 0, servings = 0;
  for (const wk of weeks) for (const s of wk.sessions) for (const it of s.items) {
    const r = ctx.byId(it.recipeId);
    if (!r) continue;
    servings += it.servings;
    for (const ing of r.ingredients) {
      const e = map.get(ing) || { name: ing, servings: 0, staple: isStaple(ing), owned: ctx.owned(ing) };
      e.servings += it.servings;
      map.set(ing, e);
    }
  }
  const items = [...map.values()].map((e) => ({ ...e, cost: e.owned ? 0 : e.staple ? STAPLE[e.name] : e.servings * servingPrice(e.name) }));
  items.forEach((e) => { total += e.cost; });
  items.sort((x, y) => (x.owned - y.owned) || y.cost - x.cost);
  return { items, total, servings };
}

// ---------- UI ----------
export function MealPrepScreen({ ui, plan, setPlan, draft, setDraft, recipes, matchInfo, allergiesFor, owned, country, dailyGoal, onCook, onAddToShopping, onBack }) {
  const { language } = useContext(ui.LanguageContext);
  const tr = (k, vars) => { let s = (MP[k] && (MP[k][language] || MP[k].en)) || k; if (vars) for (const [kk, v] of Object.entries(vars)) s = s.replace(`{${kk}}`, v); return s; };
  const L = (o) => o[language] || o.en;
  const money = useMemo(() => moneyFormatter(country, language), [country, language]);
  const byId = useMemo(() => { const m = new Map(recipes.map((r) => [r.id, r])); return (id) => m.get(id); }, [recipes]);
  const ctx = { recipes, matchInfo, allergiesFor, owned, rate: money.rate, byId };
  const [step, setStep] = useState(plan ? null : draft ? 0 : null); // null = overview
  const [week, setWeek] = useState(0);
  const [addedMsg, setAddedMsg] = useState(false);
  const { styles, COLORS, RecipeImage, recipeName, ingredientLabel } = ui;
  const mealLabel = (id) => ui.mealLabel(id, language);
  const a = draft || plan?.answers || DEFAULT_ANSWERS;
  const setA = (patch) => setDraft({ ...a, ...patch });
  const toggleIn = (key, id) => setA({ [key]: a[key].includes(id) ? a[key].filter((x) => x !== id) : [...a[key], id] });

  const header = (
    <button onClick={onBack} style={styles.backRow}>
      <ui.ArrowLeft className="ms-flip" size={18} color={COLORS.inkMuted} />
      <span style={{ marginInlineStart: 6, fontSize: 14, color: COLORS.inkMuted }}>{tr("back")}</span>
    </button>
  );

  const tile = (active) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", borderRadius: 14, cursor: "pointer", textAlign: "start", width: "100%",
    border: `1.5px solid ${active ? COLORS.primary : COLORS.line}`, background: active ? COLORS.sage : COLORS.card, color: COLORS.ink, fontFamily: "'Inter', sans-serif", fontSize: 14,
  });
  const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginTop: 14 };
  const numBtn = (active) => ({ ...tile(active), justifyContent: "center", fontWeight: 600, fontSize: 16, padding: "14px 0" });
  const fmtDay = (offset, opts = { weekday: "short", month: "short", day: "numeric" }) => {
    try { return new Intl.DateTimeFormat(LOCALES[language] || "en-CA", opts).format(dayDate(plan?.startDate, offset)); } catch { return dayDate(plan?.startDate, offset).toDateString(); }
  };

  const sessLabel = (m) => (m >= 60 ? `${m / 60 === Math.floor(m / 60) ? m / 60 : (m / 60).toFixed(1)} h${m === 150 ? "+" : ""}` : `${m} min`);
  const num = (n) => { try { return new Intl.NumberFormat(LOCALES[language] || "en-CA").format(Math.round(n)); } catch { return String(Math.round(n)); } };
  const stepper = (value, onMinus, onPlus, label, width = 70) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button style={{ ...styles.stepperButton, width: 34, height: 34 }} onClick={onMinus} aria-label={`${label} −`}>−</button>
      <span style={{ minWidth: width, textAlign: "center", fontWeight: 700, fontSize: 15 }}>{value}</span>
      <button style={{ ...styles.stepperButton, width: 34, height: 34 }} onClick={onPlus} aria-label={`${label} +`}>+</button>
    </div>
  );
  const fieldRow = (label, control, note) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 0", borderTop: `1px solid ${COLORS.line}`, flexWrap: "wrap" }}>
      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{label}{note && <div style={{ fontSize: 11.5, fontWeight: 400, color: COLORS.inkMuted }}>{note}</div>}</div>
      {control}
    </div>
  );

  // Calories ↔ portion size ↔ servings. Changing one updates the others.
  const NutritionCard = ({ planObj, answers, onChange }) => {
    const n = planNutrition(planObj, byId);
    const share = mealShare(answers.meals);
    const goal = answers.dailyCal || dailyGoal || 2000;
    const target = goal * share;
    const portion = planObj.portion || 1;
    const gives = n.cal * portion;
    const diff = gives - target;
    const ok = target > 0 && Math.abs(diff) <= target * 0.1;
    const setGoal = (v) => onChange({ dailyCal: Math.max(1000, Math.min(5000, v)), portionMode: "auto" });
    const setPortion = (v) => { const pv = Math.max(PORTION_MIN, Math.min(PORTION_MAX, v)); onChange({ portion: pv, portionMode: "manual", dailyCal: Math.max(1000, Math.min(5000, roundTo((n.cal * pv) / share, 50))) }); };
    const source = dailyGoal && goal === dailyGoal ? tr("fromGoals") : !dailyGoal && goal === 2000 ? tr("typical") : null;
    return (
      <div style={{ marginTop: 14, background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: "12px 16px" }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>🔥 {tr("nutrTitle")}</div>
        {fieldRow(tr("dailyGoal"), stepper(`${num(goal)} kcal`, () => setGoal(goal - 100), () => setGoal(goal + 100), tr("dailyGoal"), 96), source)}
        {fieldRow(tr("portion"), stepper(`×${portion.toFixed(2).replace(/0$/, "")}`, () => setPortion(portion - 0.25), () => setPortion(portion + 0.25), tr("portion")))}
        <div style={{ fontSize: 12.5, color: COLORS.inkMuted, marginTop: 4 }}>{tr("coverShare", { p: Math.round(share * 100), n: num(target) })}</div>
        <div style={{ fontSize: 14, marginTop: 10 }}>
          <strong>{tr("planGives", { n: num(gives) })}</strong>
          {n.max > n.min && <span style={{ color: COLORS.inkMuted, fontSize: 12.5 }}> ({tr("range", { a: num(n.min * portion), b: num(n.max * portion) })})</span>}
        </div>
        <div style={{ fontSize: 12.5, color: COLORS.inkMuted, marginTop: 4 }}>{tr("macrosLine", { p: num(n.p * portion), c: num(n.c * portion), f: num(n.f * portion) })}</div>
        <div style={{ marginTop: 8, fontWeight: 600, fontSize: 13.5, color: ok ? COLORS.primaryText : COLORS.accentText }}>
          {ok ? `✓ ${tr("onTarget")}` : diff < 0 ? tr("underBy", { n: num(-diff) }) : tr("overBy", { n: num(diff) })}
        </div>
        {!ok && planObj.clamp === "hi" && <div style={{ fontSize: 12, color: COLORS.inkMuted, marginTop: 2 }}>{tr("clampHi")}</div>}
        {!ok && planObj.clamp === "lo" && <div style={{ fontSize: 12, color: COLORS.inkMuted, marginTop: 2 }}>{tr("clampLo")}</div>}
        <div style={{ fontSize: 11.5, color: COLORS.inkMuted, marginTop: 8 }}>{tr("nutrNote")}</div>
      </div>
    );
  };

  // ---------- Questionnaire ----------
  const STEPS = ["reasons", "prefs", "people", "meals", "cooking", "length", "budget", "summary"];
  if (step !== null) {
    const key = STEPS[step];
    const last = step === STEPS.length - 1;
    const days = planDays(a);
    const meals = a.meals.length ? a.meals : ["dinner"];
    const preview = last ? buildPlan(a, ctx, a.seed || 7) : null;
    const g = preview ? groceriesFor(preview.weeks, ctx) : null;
    const wb = weeklyBudgetCad(a, money.rate);
    const perWeekCad = g ? (g.total * 7) / days : 0;
    const recipesPerWeek = Math.min(a.sessions, 7) * meals.length;
    const canNext = key !== "meals" || a.meals.length > 0;
    return (
      <div style={styles.screenPad}>
        <button onClick={() => (step === 0 ? (setStep(null), setDraft(null)) : setStep(step - 1))} style={styles.backRow}>
          <ui.ArrowLeft className="ms-flip" size={18} color={COLORS.inkMuted} />
          <span style={{ marginInlineStart: 6, fontSize: 14, color: COLORS.inkMuted }}>{tr("back")}</span>
        </button>
        <div style={{ fontSize: 12, color: COLORS.inkMuted, marginTop: 6 }}>{tr("stepOf", { n: step + 1, total: STEPS.length })}</div>
        <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>

        {key === "reasons" && (<>
          <h1 style={{ ...styles.h1, fontSize: 23, marginTop: 18 }}>{tr("q1")}</h1>
          <p style={styles.subtext}>{tr("pickAny")}</p>
          <div style={grid}>
            {MP_REASONS.map((r) => (
              <button key={r.id} onClick={() => toggleIn("reasons", r.id)} style={{ ...tile(a.reasons.includes(r.id)), flexDirection: "column", alignItems: "flex-start", gap: 4 }} aria-pressed={a.reasons.includes(r.id)}>
                <span style={{ fontSize: 22 }} aria-hidden="true">{r.emoji}</span>
                <span style={{ fontWeight: 600 }}>{L(r.label)}</span>
                <span style={{ fontSize: 12, color: COLORS.inkMuted, lineHeight: 1.35 }}>{L(r.why)}</span>
              </button>
            ))}
          </div>
        </>)}

        {key === "prefs" && (<>
          <h1 style={{ ...styles.h1, fontSize: 23, marginTop: 18 }}>{tr("q2")}</h1>
          <p style={styles.subtext}>{tr("q2hint")}</p>
          <div style={grid}>
            {MP_PREFS.map((p) => (
              <button key={p.id} onClick={() => toggleIn("prefs", p.id)} style={tile(a.prefs.includes(p.id))} aria-pressed={a.prefs.includes(p.id)}>
                <span style={{ fontSize: 20 }} aria-hidden="true">{p.emoji}</span><span style={{ fontWeight: 600 }}>{L(p.label)}</span>
                {a.prefs.includes(p.id) && <ui.Check size={16} color={COLORS.primaryText} style={{ marginInlineStart: "auto" }} />}
              </button>
            ))}
          </div>
        </>)}

        {key === "people" && (<>
          <h1 style={{ ...styles.h1, fontSize: 23, marginTop: 18 }}>{tr("q3")}</h1>
          <div style={{ ...grid, gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button key={n} onClick={() => setA({ people: n })} style={numBtn(a.people === n)} aria-pressed={a.people === n}>
                {n} <span style={{ fontWeight: 400, fontSize: 13, marginInlineStart: 4 }}>{n === 1 ? tr("person") : tr("people")}</span>
              </button>
            ))}
          </div>
        </>)}

        {key === "meals" && (<>
          <h1 style={{ ...styles.h1, fontSize: 23, marginTop: 18 }}>{tr("q4")}</h1>
          <p style={styles.subtext}>{tr("pickAny")}</p>
          <div style={{ ...grid, gridTemplateColumns: "repeat(2, 1fr)" }}>
            {ui.MEAL_TIMES.map((m) => (
              <button key={m.id} onClick={() => toggleIn("meals", m.id)} style={tile(a.meals.includes(m.id))} aria-pressed={a.meals.includes(m.id)}>
                <span style={{ fontSize: 20 }} aria-hidden="true">{m.emoji}</span><span style={{ fontWeight: 600 }}>{mealLabel(m.id)}</span>
              </button>
            ))}
          </div>
        </>)}

        {key === "cooking" && (<>
          <h1 style={{ ...styles.h1, fontSize: 23, marginTop: 18 }}>{tr("q5")}</h1>
          <div style={{ ...styles.stepperRow, marginTop: 16 }}>
            <button style={styles.stepperButton} onClick={() => setA({ sessions: Math.max(1, a.sessions - 1) })} aria-label="−">−</button>
            <span style={{ fontSize: 22, fontWeight: 700, minWidth: 26, textAlign: "center" }}>{a.sessions}</span>
            <button style={styles.stepperButton} onClick={() => setA({ sessions: Math.min(7, a.sessions + 1) })} aria-label="+">+</button>
            <span style={{ fontSize: 14, color: COLORS.inkMuted }}>{tr("timesWeek")}</span>
          </div>
          <div style={{ ...styles.sectionLabel, marginTop: 24 }}>{tr("sessionLen")}</div>
          <div style={{ ...grid, marginTop: 0, gridTemplateColumns: "repeat(2, 1fr)" }}>
            {SESSION_OPTS.map((m) => (
              <button key={m} onClick={() => setA({ sessionMin: m })} style={numBtn(a.sessionMin === m)} aria-pressed={a.sessionMin === m}>
                {sessLabel(m)}
              </button>
            ))}
          </div>
        </>)}

        {key === "length" && (<>
          <h1 style={{ ...styles.h1, fontSize: 23, marginTop: 18 }}>{tr("q6")}</h1>
          <div style={{ ...grid, gridTemplateColumns: "repeat(2, 1fr)" }}>
            {LENGTHS.map((l) => (
              <button key={l.id} onClick={() => setA({ length: l.id })} style={numBtn(a.length === l.id)} aria-pressed={a.length === l.id}>{tr(l.key)}</button>
            ))}
          </div>
          {a.length === "custom" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
              <input type="number" min={3} max={31} value={a.days} onChange={(e) => setA({ days: e.target.value })} style={{ ...styles.textInput, maxWidth: 110 }} aria-label={tr("daysLabel")} />
              <span style={{ color: COLORS.inkMuted }}>{tr("daysLabel")} (3–31)</span>
            </div>
          )}
        </>)}

        {key === "budget" && (<>
          <h1 style={{ ...styles.h1, fontSize: 23, marginTop: 18 }}>{tr("q7")}</h1>
          <p style={styles.subtext}>{tr("q7hint")}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: COLORS.inkMuted }}>{money.symbol}</span>
            <input inputMode="decimal" value={a.budget} onChange={(e) => setA({ budget: e.target.value.replace(/[^0-9.,]/g, "") })} placeholder="0" style={{ ...styles.textInput, maxWidth: 160, fontSize: 18 }} aria-label={tr("budget")} />
          </div>
          <div style={styles.modeRow}>
            {["week", "plan"].map((p) => (
              <button key={p} onClick={() => setA({ budgetPer: p })} style={a.budgetPer === p ? { ...styles.modeButton, ...styles.modeButtonActive } : styles.modeButton}>{tr(p === "week" ? "perWeek" : "perPlan")}</button>
            ))}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, fontSize: 14, cursor: "pointer" }}>
            <input type="checkbox" checked={a.useKitchen} onChange={(e) => setA({ useKitchen: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--ms-primary)" }} />
            {tr("useKitchen")}
          </label>
        </>)}

        {key === "summary" && (<>
          <h1 style={{ ...styles.h1, fontSize: 23, marginTop: 18 }}>{tr("summary")}</h1>
          {preview && <NutritionCard planObj={preview} answers={a} onChange={(patch) => setA(patch)} />}
          <div style={{ marginTop: 14, background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: "6px 16px" }}>
            {[
              [tr("recipesWeek"), recipesPerWeek],
              [tr("servingsWeek"), a.people * meals.length * 7],
              [tr("cookDays"), Math.min(a.sessions, 7)],
              [tr("q6").replace("?", ""), a.length === "custom" ? `${days} ${tr("daysLabel")}` : tr(LENGTHS.find((l) => l.id === a.length).key)],
              [tr("perServing"), g && g.servings ? money.fmt(g.total / g.servings) : "–"],
              [tr("weekly"), money.fmt(perWeekCad)],
              [tr("totalPlan"), money.fmt(g ? g.total : 0)],
              ...(wb != null ? [[tr("budget"), money.fmt(a.budgetPer === "plan" ? (wb * days) / 7 : wb) + (a.budgetPer === "plan" ? "" : ` / ${tr("perWeek").toLowerCase()}`)]] : []),
            ].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "11px 0", borderBottom: `1px solid ${COLORS.line}`, fontSize: 14 }}>
                <span style={{ color: COLORS.inkMuted }}>{k}</span><strong>{v}</strong>
              </div>
            ))}
            {wb != null && g && (
              <div style={{ padding: "12px 0", fontWeight: 600, color: perWeekCad <= wb ? COLORS.primaryText : COLORS.accentText }}>
                {perWeekCad <= wb ? `✓ ${tr("within")}` : tr("over", { x: money.fmt(((perWeekCad - wb) * days) / 7) })}
                {perWeekCad > wb && <div style={{ fontWeight: 400, fontSize: 12.5, color: COLORS.inkMuted, marginTop: 4 }}>{tr("overTip")}</div>}
              </div>
            )}
          </div>
          <p style={{ ...styles.subtext, marginTop: 10 }}>{tr("estNote")}</p>
          {preview && preview.weeks.every((w) => w.sessions.every((s) => s.items.every((it) => !it.recipeId))) && <p style={{ color: COLORS.accentText, fontSize: 13 }}>{tr("noRecipes")}</p>}
        </>)}

        <button
          disabled={!canNext}
          onClick={() => {
            if (!last) { setStep(step + 1); return; }
            setPlan(buildPlan(a, ctx, a.seed || 7));
            setDraft(null); setStep(null); setWeek(0);
          }}
          style={{ ...styles.primaryButton, opacity: canNext ? 1 : 0.5 }}>
          {last ? tr("create") : tr("next")}
        </button>
      </div>
    );
  }

  // ---------- No plan yet: why + start ----------
  if (!plan) {
    return (
      <div style={styles.screenPad}>
        {header}
        <h1 style={{ ...styles.h1, marginTop: 6 }}>{tr("title")}</h1>
        <p style={styles.subtext}>{tr("sub")}</p>
        <div style={styles.tipCard}><div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{tr("optional")}</div></div>
        <div style={{ ...styles.sectionLabel, marginTop: 22 }}>{tr("whyTitle")}</div>
        <div style={{ display: "grid", gap: 8 }}>
          {MP_REASONS.map((r) => (
            <div key={r.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 12px", background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 12 }}>
              <span style={{ fontSize: 20 }} aria-hidden="true">{r.emoji}</span>
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>{L(r.label)}</div><div style={{ fontSize: 12.5, color: COLORS.inkMuted, marginTop: 2 }}>{L(r.why)}</div></div>
            </div>
          ))}
        </div>
        <button data-tour="mealprep-start" onClick={() => { setDraft({ ...DEFAULT_ANSWERS, dailyCal: dailyGoal || 2000, seed: newSeed() }); setStep(0); }} style={styles.primaryButton}>{tr("start")}</button>
      </div>
    );
  }

  // ---------- The plan ----------
  // Apply a change to the plan's answers. Structural changes re-pick recipes (same seed, same start
  // date); amount changes keep the recipes and just recompute portions, servings, groceries and cost.
  const apply = (patch, repick) => {
    const na = { ...plan.answers, ...(repick ? { portionMode: "auto" } : {}), ...patch };
    const next = repick ? { ...buildPlan(na, ctx, plan.seed || 7), startDate: plan.startDate } : finalizePlan({ ...plan, answers: na }, byId);
    setPlan(next);
    setWeek((w) => Math.min(w, next.weeks.length - 1));
  };
  const AdjustPanel = () => {
    const a2 = plan.answers;
    const [budgetText, setBudgetText] = useState(a2.budget || "");
    const [daysText, setDaysText] = useState(String(a2.days || 10));
    const chip = (active) => ({ ...styles.equipChip, ...(active ? styles.equipChipActive : {}), padding: "6px 11px", fontSize: 12.5 });
    return (
      <div style={{ marginTop: 16, background: COLORS.sageSofter, border: `1px solid ${COLORS.sage}`, borderRadius: 16, padding: "14px 16px" }}>
        <div style={{ fontWeight: 700, fontSize: 15.5 }}>⚙️ {tr("adjustTitle")}</div>
        <div style={{ fontSize: 12.5, color: COLORS.inkMuted, marginTop: 2 }}>{tr("adjustSub")}</div>
        <NutritionCard planObj={plan} answers={a2} onChange={(patch) => apply(patch, false)} />
        <div style={{ marginTop: 12 }}>
          {fieldRow(tr("peopleShort"), stepper(a2.people, () => apply({ people: Math.max(1, a2.people - 1) }, false), () => apply({ people: Math.min(12, a2.people + 1) }, false), tr("peopleShort"), 40))}
          {fieldRow(tr("budget"), (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ color: COLORS.inkMuted }}>{money.symbol}</span>
              <input inputMode="decimal" value={budgetText} placeholder="–" onChange={(e) => setBudgetText(e.target.value.replace(/[^0-9.,]/g, ""))}
                onBlur={() => budgetText !== (a2.budget || "") && apply({ budget: budgetText }, true)}
                onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                style={{ ...styles.textInput, width: 90, flex: "none", padding: "8px 10px" }} aria-label={tr("budget")} />
              <select value={a2.budgetPer} onChange={(e) => apply({ budgetPer: e.target.value, budget: budgetText }, true)} style={{ ...styles.selectInput, width: "auto", padding: "8px 10px" }}>
                <option value="week">{tr("perWeek")}</option><option value="plan">{tr("perPlan")}</option>
              </select>
            </div>
          ))}
        </div>
        <div style={{ ...styles.sectionLabel, marginTop: 14, marginBottom: 2 }}>{tr("repickNote")}</div>
        {fieldRow(tr("mealsShort"), (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ui.MEAL_TIMES.map((m) => {
              const on = a2.meals.includes(m.id);
              return <button key={m.id} aria-pressed={on} style={chip(on)} onClick={() => { const meals = on ? a2.meals.filter((x) => x !== m.id) : [...a2.meals, m.id]; if (meals.length) apply({ meals }, true); }}>{m.emoji} {mealLabel(m.id)}</button>;
            })}
          </div>
        ))}
        {fieldRow(tr("cooksShort"), stepper(a2.sessions, () => apply({ sessions: Math.max(1, a2.sessions - 1) }, true), () => apply({ sessions: Math.min(7, a2.sessions + 1) }, true), tr("cooksShort"), 40))}
        {fieldRow(tr("sessionShort"), (
          <select value={a2.sessionMin} onChange={(e) => apply({ sessionMin: Number(e.target.value) }, true)} style={{ ...styles.selectInput, width: "auto", padding: "8px 10px" }}>
            {SESSION_OPTS.map((m) => <option key={m} value={m}>{sessLabel(m)}</option>)}
          </select>
        ))}
        {fieldRow(tr("lengthShort"), (
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <select value={a2.length} onChange={(e) => apply({ length: e.target.value, days: daysText }, true)} style={{ ...styles.selectInput, width: "auto", padding: "8px 10px" }}>
              {LENGTHS.map((l) => <option key={l.id} value={l.id}>{tr(l.key)}</option>)}
            </select>
            {a2.length === "custom" && (
              <input type="number" min={3} max={31} value={daysText} onChange={(e) => setDaysText(e.target.value)}
                onBlur={() => apply({ days: daysText }, true)} onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                style={{ ...styles.textInput, width: 70, flex: "none", padding: "8px 10px" }} aria-label={tr("daysLabel")} />
            )}
          </div>
        ))}
        {fieldRow(tr("prefsShort"), (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {MP_PREFS.map((pf) => {
              const on = a2.prefs.includes(pf.id);
              return <button key={pf.id} aria-pressed={on} style={chip(on)} onClick={() => apply({ prefs: on ? a2.prefs.filter((x) => x !== pf.id) : [...a2.prefs, pf.id] }, true)}>{pf.emoji} {L(pf.label)}</button>;
            })}
          </div>
        ))}
      </div>
    );
  };
  const wk = plan.weeks[Math.min(week, plan.weeks.length - 1)];
  const days = planDays(plan.answers);
  const all = groceriesFor(plan.weeks, ctx);
  const thisWeek = groceriesFor([wk], ctx);
  const wb = weeklyBudgetCad(plan.answers, money.rate);
  const budgetPlanCad = wb != null ? (wb * days) / 7 : null;
  const toBuy = thisWeek.items.filter((i) => !i.owned);
  const have = thisWeek.items.filter((i) => i.owned);
  const wStart = Math.min(week, plan.weeks.length - 1) * 7;
  const dayNutr = planNutrition(plan, byId);
  const wLen = Math.min(7, days - wStart);
  const endOffset = days - 1;

  return (
    <div style={styles.screenPad}>
      {header}
      <h1 style={{ ...styles.h1, marginTop: 6 }}>{tr("title")}</h1>
      <p style={styles.subtext}>{fmtDay(0, { month: "short", day: "numeric" })} – {fmtDay(endOffset, { month: "short", day: "numeric" })} · {plan.answers.people} {plan.answers.people === 1 ? tr("person") : tr("people")} · {(plan.answers.meals || []).map(mealLabel).join(", ")}</p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
        <button style={styles.linkButton} onClick={() => { setDraft({ ...plan.answers, seed: newSeed() }); setStep(0); }}>{tr("edit")}</button>
        <button style={styles.linkButton} onClick={() => setPlan(buildPlan(plan.answers, ctx, newSeed()))}>{tr("remake")}</button>
        <button style={{ ...styles.linkButton, color: COLORS.accentText }} onClick={() => setPlan(null)}>{tr("remove")}</button>
      </div>

      <AdjustPanel />

      <div style={{ marginTop: 16, background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 13, color: COLORS.inkMuted }}>{tr("totalPlan")}</span>
          <strong style={{ fontSize: 20 }}>{money.fmt(all.total)}</strong>
        </div>
        <div style={{ fontSize: 12.5, color: COLORS.inkMuted, marginTop: 2 }}>{all.servings ? `${money.fmt(all.total / all.servings)} · ${tr("perServing").toLowerCase()}` : ""}</div>
        {budgetPlanCad != null && (<>
          <div style={{ ...styles.progressTrack, height: 8, borderRadius: 4 }}>
            <div style={{ ...styles.progressFill, width: `${Math.min(100, (all.total / budgetPlanCad) * 100)}%`, background: all.total <= budgetPlanCad ? COLORS.primary : COLORS.accent }} />
          </div>
          <div style={{ fontSize: 13, marginTop: 8, fontWeight: 600, color: all.total <= budgetPlanCad ? COLORS.primaryText : COLORS.accentText }}>
            {all.total <= budgetPlanCad ? `✓ ${tr("within")} (${money.fmt(budgetPlanCad)})` : tr("over", { x: money.fmt(all.total - budgetPlanCad) })}
          </div>
        </>)}
        <div style={{ fontSize: 11.5, color: COLORS.inkMuted, marginTop: 8 }}>{tr("estNote")}</div>
      </div>
      {plan.relaxed && <p style={{ ...styles.subtext, marginTop: 10 }}>{tr("relaxed")}</p>}

      {plan.weeks.length > 1 && (
        <div style={{ ...styles.modeRow, overflowX: "auto" }}>
          {plan.weeks.map((_, i) => (
            <button key={i} onClick={() => setWeek(i)} style={week === i ? { ...styles.modeButton, ...styles.modeButtonActive, minWidth: 74 } : { ...styles.modeButton, minWidth: 74 }}>{tr("week", { n: i + 1 })}</button>
          ))}
        </div>
      )}

      {wk.sessions.map((s, si) => {
        const mins = s.items.reduce((sum, it) => sum + (byId(it.recipeId) ? recipeMinutes(byId(it.recipeId)) : 0), 0);
        return (
          <div key={si} style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>👩‍🍳 {tr("cookDay")} · {fmtDay(s.start)}</div>
              <div style={{ fontSize: 12, color: COLORS.inkMuted }}>{tr("about", { n: mins })}</div>
            </div>
            {s.items.map((it, ii) => {
              const r = byId(it.recipeId);
              if (!r) return <div key={ii} style={{ ...styles.recipeCard, cursor: "default", color: COLORS.inkMuted, fontSize: 13 }}>{mealLabel(it.meal)}: {tr("noRecipes")}</div>;
              const fridgeEnd = Math.min(s.len, 4) - 1;
              return (
                <div key={ii} style={{ ...styles.recipeCard, cursor: "default", marginTop: 8, marginBottom: 0 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <RecipeImage recipe={r} height={56} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, color: COLORS.inkMuted }}>{mealLabel(it.meal)}</div>
                      <div style={styles.recipeName}>{recipeName(r, language)}</div>
                      <div style={{ ...styles.recipeMeta, whiteSpace: "normal" }}>
                        {tr("makes", { n: it.servings })} · {s.len > 1 ? tr("covers", { from: fmtDay(s.start, { weekday: "short" }), to: fmtDay(s.start + s.len - 1, { weekday: "short" }) }) : tr("coversOne", { from: fmtDay(s.start, { weekday: "short" }) })}
                        {s.len > 4 ? ` · ❄️ ${fmtDay(s.start + fridgeEnd + 1, { weekday: "short" })}+` : ""}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button onClick={() => setPlan(swapPick(plan, week, si, ii, ctx))} style={{ ...styles.resetButton, flex: 1, justifyContent: "center", gap: 6 }}>
                      <ui.RotateCcw size={14} color={COLORS.inkMuted} /> {tr("swap")}
                    </button>
                    <button onClick={() => onCook(r, it.servings)} style={{ ...styles.resetButton, flex: 1, justifyContent: "center", background: COLORS.primary, color: "#fff", border: "none", fontWeight: 600 }}>{tr("cookIt")}</button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <div style={{ ...styles.sectionLabel, marginTop: 24 }}>{tr("calendar")}</div>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 14, overflow: "hidden" }}>
        {Array.from({ length: wLen }, (_, d) => {
          const day = wStart + d;
          const s = wk.sessions.find((x) => day >= x.start && day < x.start + x.len);
          return (
            <div key={d} style={{ display: "flex", gap: 10, padding: "9px 12px", borderTop: d ? `1px solid ${COLORS.line}` : "none", alignItems: "flex-start" }}>
              <div style={{ width: 84, flexShrink: 0, fontSize: 12.5, fontWeight: 600 }}>{fmtDay(day)}<div style={{ fontWeight: 400, fontSize: 11.5, color: COLORS.inkMuted }}>~{num((dayNutr.perDay[day]?.cal || 0) * (plan.portion || 1))} kcal</div></div>
              <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 3 }}>
                {s && s.items.map((it, ii) => {
                  const r = byId(it.recipeId);
                  if (!r) return null;
                  const age = day - s.start;
                  const where = age === 0 ? tr("fresh") : age < 4 ? tr("fridge") : tr("freezer");
                  return <div key={ii} style={{ fontSize: 12.5, lineHeight: 1.35 }}><span style={{ color: COLORS.inkMuted }}>{mealLabel(it.meal)}:</span> {recipeName(r, language)} <span style={{ color: age >= 4 ? COLORS.accentText : COLORS.inkMuted }}>· {age >= 4 ? "❄️ " : age === 0 ? "🔥 " : ""}{where}</span></div>;
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ ...styles.sectionLabel, marginTop: 24 }}>{tr("groceries")}{plan.weeks.length > 1 ? ` · ${tr("week", { n: week + 1 })}` : ""}</div>
      {toBuy.length === 0 ? <p style={styles.subtext}>{tr("nothingToBuy")}</p> : (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: "2px 14px" }}>
          {toBuy.map((i) => (
            <div key={i.name} style={{ ...styles.shoppingRow, justifyContent: "space-between" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{ingredientLabel(i.name, language)}</div>
                <div style={{ fontSize: 12, color: COLORS.inkMuted }}>{i.staple ? tr("staple") : tr("forServings", { n: i.servings })}</div>
              </div>
              <span style={{ fontSize: 13, color: COLORS.inkMuted, flexShrink: 0 }}>{money.fmt(i.cost)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontWeight: 700, fontSize: 14 }}>
            <span>{tr("weekly").replace(/\s*\(.*\)/, "")}</span><span>{money.fmt(thisWeek.total)}</span>
          </div>
        </div>
      )}
      {have.length > 0 && (
        <p style={{ ...styles.subtext, marginTop: 10 }}><strong>{tr("haveAlready")}:</strong> {have.map((i) => ingredientLabel(i.name, language)).join(", ")}</p>
      )}
      {toBuy.length > 0 && (
        <button onClick={() => { onAddToShopping(toBuy.map((i) => i.name)); setAddedMsg(true); setTimeout(() => setAddedMsg(false), 2200); }} style={{ ...styles.goCookButton, justifyContent: "center", gap: 8 }}>
          <ui.ShoppingCart size={16} color="#fff" /> {addedMsg ? tr("added") : tr("addAll", { n: toBuy.length })}
        </button>
      )}

      <div style={{ ...styles.tipCard, marginTop: 22 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5 }}>🧊 {tr("storageTitle")}</div>
        <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>{tr("storageBody")}</div>
      </div>
    </div>
  );
}

// Card on Home: points to meal prep without pushing it.
export function MealPrepHomeCard({ ui, hasPlan, onOpen }) {
  const { language } = useContext(ui.LanguageContext);
  const tr = (k) => MP[k][language] || MP[k].en;
  const { styles, COLORS } = ui;
  return (
    <button onClick={onOpen} style={{ marginTop: 16, width: "100%", textAlign: "start", display: "flex", gap: 12, alignItems: "center", background: COLORS.accentSofter, border: `1px solid ${COLORS.accentSoft}`, borderRadius: 14, padding: 14, cursor: "pointer", color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
      <span style={{ fontSize: 28 }} aria-hidden="true">🍱</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontWeight: 700, fontSize: 14.5 }}>{hasPlan ? tr("title") : tr("homeTitle")}</span>
        <span style={{ display: "block", fontSize: 12.5, color: COLORS.inkMuted, marginTop: 2, lineHeight: 1.4 }}>{hasPlan ? tr("sub") : tr("homeBody")}</span>
        <span style={{ display: "inline-block", marginTop: 6, fontSize: 13, fontWeight: 600, color: COLORS.primaryText }}>{hasPlan ? tr("homeOpen") : tr("homeCta")} →</span>
      </span>
    </button>
  );
}
