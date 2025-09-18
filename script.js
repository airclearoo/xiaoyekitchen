// 菜单数据
const menuData = {
    main: [
        "红烧排骨", "糖醋里脊", "宫保鸡丁", "鱼香肉丝", "麻婆豆腐",
        "水煮肉片", "回锅肉", "红烧肉", "清蒸鱼", "干锅牛肉",
        "蒜蓉粉丝娃娃菜", "葱爆羊肉", "酸菜鱼", "铁板牛柳", "咖喱鸡块"
    ],
    side: [
        "凉拌黄瓜", "蒜蓉西兰花", "干煸四季豆", "醋溜白菜", "炝炒空心菜",
        "蒜蓉茼蒿", "香菇青菜", "上汤娃娃菜", "清炒菠菜", "木耳炒芹菜",
        "凉拌海带丝", "拍黄瓜", "糖醋藕片", "蒜蓉茄子", "香辣土豆丝"
    ],
    soup: [
        "番茄蛋花汤", "紫菜蛋花汤", "西红柿牛腩汤", "冬瓜排骨汤", "鸡蛋豆腐汤",
        "酸辣汤", "玉米排骨汤", "海带豆腐汤", "萝卜牛腩汤", "鲜蘑菇汤"
    ],
    drink: [
        "可乐", "雪碧", "橙汁", "柠檬水", "奶茶",
        "矿泉水", "绿茶", "红茶", "啤酒", "果汁"
    ]
};

// DOM元素
const mainDishesEl = document.getElementById('main-dishes');
const sideDishesEl = document.getElementById('side-dishes');
const soupsEl = document.getElementById('soups');
const drinksEl = document.getElementById('drinks');
const selectedDishesEl = document.getElementById('selected-dishes');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const downloadBtn = document.getElementById('download-btn');
const downloadImgBtn = document.getElementById('download-img-btn');
const customDishNameInput = document.getElementById('custom-dish-name');
const customDishCategorySelect = document.getElementById('custom-dish-category');
const addCustomDishBtn = document.getElementById('add-custom-dish');
const loadOrderFileInput = document.getElementById('load-order-file');
const loadOrderBtn = document.getElementById('load-order-btn');
const orderPreviewEl = document.getElementById('order-preview');
const orderCanvas = document.getElementById('order-canvas');

// 存储已选菜品
let selectedDishes = [];
// 存储自定义菜品
let customDishes = {
    main: [],
    side: [],
    soup: [],
    drink: []
};

// 初始化菜单
function initializeMenu() {
    renderDishes(menuData.main.concat(customDishes.main), mainDishesEl, 'main');
    renderDishes(menuData.side.concat(customDishes.side), sideDishesEl, 'side');
    renderDishes(menuData.soup.concat(customDishes.soup), soupsEl, 'soup');
    renderDishes(menuData.drink.concat(customDishes.drink), drinksEl, 'drink');
}

// 渲染菜品
function renderDishes(dishes, container, category) {
    container.innerHTML = '';
    dishes.forEach(dish => {
        const dishEl = document.createElement('div');
        dishEl.className = 'dish-item';
        dishEl.textContent = dish;
        dishEl.dataset.name = dish;
        dishEl.dataset.category = category;
        
        // 检查是否已选择
        if (selectedDishes.some(item => item.name === dish && item.category === category)) {
            dishEl.classList.add('selected');
        }
        
        dishEl.addEventListener('click', () => toggleDishSelection(dishEl, dish, category));
        container.appendChild(dishEl);
    });
}

// 切换菜品选择状态
function toggleDishSelection(element, dishName, category) {
    const isSelected = element.classList.toggle('selected');
    
    if (isSelected) {
        // 添加到已选菜品
        selectedDishes.push({
            name: dishName,
            category: category
        });
    } else {
        // 从已选菜品中移除
        selectedDishes = selectedDishes.filter(dish => 
            !(dish.name === dishName && dish.category === category)
        );
    }
    
    updateSelectedDishesDisplay();
}

// 更新已选菜品显示
function updateSelectedDishesDisplay() {
    if (selectedDishes.length === 0) {
        selectedDishesEl.innerHTML = '<p class="empty-selection">还没有选择任何菜品哦~</p>';
        return;
    }
    
    selectedDishesEl.innerHTML = '';
    
    // 按类别分组显示
    const categories = {
        main: { title: '荤菜', items: [] },
        side: { title: '素菜', items: [] },
        soup: { title: '汤品', items: [] },
        drink: { title: '饮料', items: [] }
    };
    
    // 分组
    selectedDishes.forEach(dish => {
        categories[dish.category].items.push(dish);
    });
    
    // 渲染每个类别
    for (const [category, data] of Object.entries(categories)) {
        if (data.items.length > 0) {
            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = data.title;
            selectedDishesEl.appendChild(categoryTitle);
            
            data.items.forEach(dish => {
                const dishEl = document.createElement('div');
                dishEl.className = 'selected-dish';
                
                const nameEl = document.createElement('span');
                nameEl.textContent = dish.name;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-dish';
                removeBtn.textContent = '×';
                removeBtn.addEventListener('click', () => removeDish(dish));
                
                dishEl.appendChild(nameEl);
                dishEl.appendChild(removeBtn);
                selectedDishesEl.appendChild(dishEl);
            });
        }
    }
}

// 移除已选菜品
function removeDish(dish) {
    // 从选择列表中移除
    selectedDishes = selectedDishes.filter(item => 
        !(item.name === dish.name && item.category === dish.category)
    );
    
    // 更新菜单中的选择状态
    const dishElements = document.querySelectorAll('.dish-item');
    dishElements.forEach(el => {
        if (el.dataset.name === dish.name && el.dataset.category === dish.category) {
            el.classList.remove('selected');
        }
    });
    
    updateSelectedDishesDisplay();
}

// 清空选择
clearBtn.addEventListener('click', () => {
    selectedDishes = [];
    document.querySelectorAll('.dish-item').forEach(el => {
        el.classList.remove('selected');
    });
    updateSelectedDishesDisplay();
});

// 创建小票样式的点菜单HTML
function createReceiptHTML() {
    // 获取当前日期和时间
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // 生成订单号（使用时间戳后6位）
    const orderNumber = Math.floor(now.getTime() % 1000000).toString().padStart(6, '0');
    
    // 按类别分组
    const categories = {
        main: { title: '荤菜', items: [] },
        side: { title: '素菜', items: [] },
        soup: { title: '汤品', items: [] },
        drink: { title: '饮料', items: [] }
    };
    
    selectedDishes.forEach(dish => {
        categories[dish.category].items.push(dish);
    });
    
    // 创建HTML
    let html = `
        <div class="receipt">
            <div class="receipt-header">
                <h3>小叶厨房</h3>
                <p>订单号: #${orderNumber}</p>
                <p>${dateStr} ${timeStr}</p>
            </div>
            <div class="receipt-divider"></div>
    `;
    
    // 添加各类别菜品
    for (const [category, data] of Object.entries(categories)) {
        if (data.items.length > 0) {
            html += `
                <div class="receipt-category">
                    <div class="receipt-category-title">${data.title}</div>
            `;
            
            data.items.forEach(dish => {
                html += `
                    <div class="receipt-item">
                        <div class="receipt-item-name">${dish.name}</div>
                        <div class="receipt-item-quantity">x1</div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
    }
    
    // 添加总计
    html += `
            <div class="receipt-divider"></div>
            <div class="receipt-total">
                <span>总计</span>
                <span>${selectedDishes.length} 道菜品</span>
            </div>
            <div class="receipt-footer">
                <div>祝您用餐愉快!</div>
            </div>
            <div class="receipt-thank-you">
                小叶厨房 &hearts;
            </div>
        </div>
    `;
    
    return html;
}

// 生成点菜单图片
function generateOrderImage() {
    return new Promise((resolve, reject) => {
        // 创建临时DOM元素来渲染点菜单
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = createReceiptHTML();
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);
        
        const receipt = tempDiv.querySelector('.receipt');
        
        // 使用html2canvas库将DOM元素转换为图片
        html2canvas(receipt, {
            backgroundColor: '#ffffff',
            scale: 2, // 提高图片质量
            logging: false,
            useCORS: true
        }).then(canvas => {
            // 清理临时DOM元素
            document.body.removeChild(tempDiv);
            
            // 返回图片URL
            const imgUrl = canvas.toDataURL('image/png');
            resolve(imgUrl);
        }).catch(error => {
            console.error('生成图片失败:', error);
            reject(error);
        });
    });
}

// 加载html2canvas库
function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        if (window.html2canvas) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('加载html2canvas库失败'));
        document.head.appendChild(script);
    });
}

// 保存点菜单
saveBtn.addEventListener('click', async () => {
    if (selectedDishes.length === 0) {
        alert('请先选择菜品哦~');
        return;
    }
    
    // 准备要保存的数据
    const orderData = {
        timestamp: new Date().toISOString(),
        dishes: selectedDishes,
        customDishes: customDishes
    };
    
    // 创建Blob对象
    const blob = new Blob([JSON.stringify(orderData, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(blob);
    
    // 设置JSON下载
    downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = jsonUrl;
        a.download = `点菜单_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    
    try {
        // 加载html2canvas库
        await loadHtml2Canvas();
        
        // 显示加载中的提示
        orderPreviewEl.innerHTML = '<p>正在生成点菜单图片...</p>';
        modal.style.display = 'block';
        
        // 确保模态框内容从顶部开始显示
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollTop = 0;
            }
        }, 10);
        
        // 生成点菜单HTML预览
        orderPreviewEl.innerHTML = createReceiptHTML();
        
        // 生成点菜单图片
        const imgUrl = await generateOrderImage();
        
        // 显示图片预览，添加缩放控制
        orderPreviewEl.innerHTML = `
            <div style="text-align: center;">
                <img src="${imgUrl}" alt="点菜单" style="max-width: 100%; max-height: 55vh;">
                <div style="margin-top: 10px; color: #666; font-size: 12px;">
                    (图片已自动缩放以适应屏幕，下载的图片为原始尺寸)
                </div>
            </div>
        `;
        
        // 确保滚动到顶部，让用户看到完整的预览和按钮
        modal.querySelector('.modal-content').scrollTop = 0;
        
        // 设置图片下载
        downloadImgBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = imgUrl;
            a.download = `点菜单_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        
        // 添加微信分享按钮
        addShareButton(imgUrl);
    } catch (error) {
        console.error('生成点菜单图片失败:', error);
        alert('生成图片失败，请重试或使用JSON格式保存');
        
        // 显示HTML预览作为备选
        orderPreviewEl.innerHTML = createReceiptHTML();
    }
});

// 关闭模态框
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 点击模态框外部关闭
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 添加自定义菜品
addCustomDishBtn.addEventListener('click', () => {
    const dishName = customDishNameInput.value.trim();
    const category = customDishCategorySelect.value;
    
    if (!dishName) {
        alert('请输入菜品名称');
        return;
    }
    
    // 检查是否已存在
    const allDishes = [...menuData[category], ...customDishes[category]];
    if (allDishes.includes(dishName)) {
        alert('该菜品已存在');
        return;
    }
    
    // 添加到自定义菜品
    customDishes[category].push(dishName);
    
    // 重新渲染菜单
    initializeMenu();
    
    // 清空输入框
    customDishNameInput.value = '';
});

// 导入点菜单
loadOrderBtn.addEventListener('click', () => {
    const file = loadOrderFileInput.files[0];
    if (!file) {
        alert('请先选择文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // 导入自定义菜品
            if (data.customDishes) {
                customDishes = data.customDishes;
            }
            
            // 导入已选菜品
            if (data.dishes) {
                selectedDishes = data.dishes;
            }
            
            // 重新渲染菜单和已选菜品
            initializeMenu();
            updateSelectedDishesDisplay();
            
            alert('点菜单导入成功！');
        } catch (error) {
            alert('文件格式错误，无法导入');
            console.error(error);
        }
    };
    reader.readAsText(file);
});

// 添加微信分享按钮功能
function addShareButton(imgUrl) {
    // 创建分享按钮
    const shareBtn = document.createElement('button');
    shareBtn.id = 'share-btn';
    shareBtn.textContent = '分享到微信';
    shareBtn.style.backgroundColor = '#07C160'; // 微信绿色
    shareBtn.style.padding = '12px 25px';
    shareBtn.style.fontSize = '16px';
    
    // 添加点击事件
    shareBtn.addEventListener('click', () => {
        // 检查是否在微信浏览器中
        const isWechat = /MicroMessenger/i.test(navigator.userAgent);
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 创建一个全屏的分享页面
        createSharePage(imgUrl);
    });
    
    // 将按钮添加到下载选项区域
    const downloadOptions = document.querySelector('.download-options');
    downloadOptions.appendChild(shareBtn);
}

// 创建分享页面
function createSharePage(imgUrl) {
    // 隐藏模态框
    modal.style.display = 'none';
    
    // 创建全屏分享页面
    const sharePage = document.createElement('div');
    sharePage.style.position = 'fixed';
    sharePage.style.top = '0';
    sharePage.style.left = '0';
    sharePage.style.width = '100%';
    sharePage.style.height = '100%';
    sharePage.style.backgroundColor = '#f5f5f5';
    sharePage.style.zIndex = '10000';
    sharePage.style.display = 'flex';
    sharePage.style.flexDirection = 'column';
    sharePage.style.alignItems = 'center';
    sharePage.style.padding = '20px';
    sharePage.style.boxSizing = 'border-box';
    sharePage.style.overflow = 'auto';
    
    // 添加内容
    sharePage.innerHTML = `
        <div style="position: absolute; top: 15px; left: 15px; font-size: 16px; cursor: pointer; background: rgba(0,0,0,0.1); border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
            ←
        </div>
        <h2 style="margin-top: 10px; margin-bottom: 20px; color: #333;">长按图片保存或分享</h2>
        <div style="text-align: center; margin-bottom: 20px; max-width: 100%;">
            <img src="${imgUrl}" alt="点菜单" style="max-width: 100%; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        </div>
        <p style="color: #666; margin-bottom: 20px; text-align: center;">↑ 长按图片可保存或直接分享到微信 ↑</p>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button id="save-share-img" style="background-color: #ff6b6b; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-size: 16px;">保存图片</button>
            <button id="close-share-page" style="background-color: #999; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-size: 16px;">返回</button>
        </div>
        <p style="color: #999; font-size: 14px; text-align: center;">
            提示：在微信中，长按图片可以直接发送给朋友或分享到朋友圈
        </p>
    `;
    
    // 添加到页面
    document.body.appendChild(sharePage);
    
    // 添加事件监听
    sharePage.querySelector('#close-share-page').addEventListener('click', () => {
        document.body.removeChild(sharePage);
        modal.style.display = 'block';
    });
    
    sharePage.querySelector('div[style*="position: absolute"]').addEventListener('click', () => {
        document.body.removeChild(sharePage);
        modal.style.display = 'block';
    });
    
    sharePage.querySelector('#save-share-img').addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = imgUrl;
        a.download = `点菜单_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    
    // 添加图片加载完成事件
    const img = sharePage.querySelector('img');
    img.onload = () => {
        // 图片加载完成后，添加提示动画
        const imgContainer = img.parentElement;
        imgContainer.innerHTML += `
            <div class="press-hint" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0,0,0,0.6);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 14px;
                animation: fadeInOut 2s ease-in-out infinite;
            ">长按图片分享</div>
        `;
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // 3秒后移除提示
        setTimeout(() => {
            const hint = document.querySelector('.press-hint');
            if (hint) hint.remove();
        }, 3000);
    };
}

// 初始化
initializeMenu();
updateSelectedDishesDisplay();