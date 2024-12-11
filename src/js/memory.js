// 记忆系统管理类
class MemorySystem {
    constructor() {
        this.storageKey = 'robotMemory';
        this.memory = this.getInitialMemory();
        this.initializeEmotionKeywords();
        this.setupAutoSave();
        this.setupAutoBackup();
        
        this.initializeMemory().then(() => {
            console.log('记忆系统初始化完成');
        }).catch(error => {
            console.error('记忆系统初始化失败:', error);
        });
    }

    async initializeMemory() {
        try {
            const loadedMemory = await this.loadMemory();
            if (loadedMemory) {
                this.memory = {
                    ...this.getInitialMemory(),
                    ...loadedMemory,
                };
                console.log('成功加载存储的记忆');
            }
        } catch (error) {
            console.error('记忆加载失败:', error);
        }
    }

    // 初始化情感关键词
    initializeEmotionKeywords() {
        this.emotionKeywords = {
            happy: ['开心', '快乐', '高兴', '幸福', '喜悦', '兴奋', '棒', '好玩', '有趣'],
            sad: ['难过', '伤心', '悲伤', '痛苦', '失落', '沮丧', '不开心', '哭'],
            angry: ['生气', '愤怒', '烦躁', '讨厌', '恼火', '不爽', '火大'],
            anxious: ['焦虑', '担心', '紧张', '害怕', '恐惧', '不安'],
            tired: ['累', '疲惫', '困', '倦', '乏', '无力'],
            lonely: ['孤独', '寂寞', '想你', '思念', '想念'],
            love: ['喜欢', '爱', '心动', '温暖', '感动', '甜蜜', '幸福']
        };
    }

    // 获取初始记忆结构
    getInitialMemory() {
        return {
            personalInfo: {
                nickname: '用户昵称',    // 用户昵称
                name: '',             // 真实姓名
                birthday: '',         // 生日
                age: '',             // 年龄
                zodiac: '',          // 星座
                bloodType: '',       // 血型
                height: '',          // 身高
                weight: '',          // 体重
                address: '',         // 地址
                hometown: '',        // 家乡
                occupation: '',      // 职业
                company: '',         // 公司
                education: '',       // 学历
                school: '',          // 学校
                major: '',           // 专业
                hobbies: [],         // 兴趣爱好
                preferences: {        // 用户偏好
                    foods: [],        // 喜欢的食物
                    colors: [],       // 喜色
                    music: [],        // 喜欢的音乐
                    movies: [],       // 喜欢的电影
                    sports: []        // 喜欢的运动
                },
                important_dates: {    // 重要日期
                    birthday: '',     // 生日
                    anniversary: '',  // 恋爱纪念日
                    graduation: '',   // 毕业日期
                    work_anniversary: '', // 工作周年
                    special_days: {}  // 其他特殊日期
                },
                first_meet: new Date().toISOString(), // 初次见面时间
                relationships: {      // 重要人际关系
                    family: {},       // 家人
                    friends: {},      // 朋友
                    colleagues: {}    // 同事
                },
                contact: {           // 联系方式
                    phone: '',
                    email: '',
                    social_media: {}
                },
                health: {            // 健康信息
                    allergies: [],    // 过敏源
                    medications: [],  // 在服用的药物
                    conditions: []    // 健康状况
                },
                daily_routine: {     // 日常习惯
                    wake_time: '',    // 起床时间
                    sleep_time: '',   // 睡觉时间
                    meal_times: {},   // 用餐时间
                    work_hours: {}    // 工作时间
                },
                emotional_state: {    // 情感状态记录
                    current: '',      // 当前情绪
                    history: [],      // 情绪历史
                    triggers: {}      // 情绪触发因素
                }
            },
            conversations: {
                key_moments: [],      // 重要对话片段
                shared_memories: [],   // 共同经历
                last_conversation: null // 上次对话时间
            },
            emotional_bonds: {
                intimacy_level: 0,    // 亲密度
                special_interactions: [], // 特殊互动记录
                mood_history: []      // 情绪历史
            },
            statistics: {
                total_conversations: 0,    // 总对话次数
                total_interactions: 0,     // 总互动次数
                favorite_topics: {},       // 喜爱的话题
                interaction_frequency: {}  // 互动��率统计
            },
            associations: []
        };
    }

    // 加载记忆
    loadMemory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                console.log('未找到存储的记忆');
                return null;
            }
            
            const parsed = JSON.parse(data);
            
            // 添加数据结构验证
            if (!parsed.data || !this.validateMemoryStructure(parsed.data)) {
                console.error('记忆数据结构无效');
                return null;
            }
            
            // 确保所有必要的字段都存在
            const memory = parsed.data;
            const defaultMemory = this.getInitialMemory();
            
            // 合并默认值和加载的数据
            return {
                personalInfo: {...defaultMemory.personalInfo, ...memory.personalInfo},
                conversations: {
                    key_moments: memory.conversations?.key_moments || [],
                    shared_memories: memory.conversations?.shared_memories || [],
                    last_conversation: memory.conversations?.last_conversation || null
                },
                emotional_bonds: {...defaultMemory.emotional_bonds, ...memory.emotional_bonds},
                statistics: {...defaultMemory.statistics, ...memory.statistics}
            };
        } catch (error) {
            console.error('加载记忆失败:', error);
            return null;
        }
    }

    // 添加更严格的数据结构验证
    validateMemoryStructure(memory) {
        if (!memory || typeof memory !== 'object') {
            console.error('无效的记忆数据格式');
            return false;
        }

        const requiredStructure = {
            personalInfo: ['nickname', 'name', 'birthday'],
            conversations: ['shared_memories', 'key_moments'],
            emotional_bonds: ['intimacy_level'],
            statistics: ['total_conversations']
        };

        try {
            // 验证基本结构
            for (const [section, fields] of Object.entries(requiredStructure)) {
                if (!memory[section] || typeof memory[section] !== 'object') {
                    console.error(`缺少必要部分: ${section}`);
                    return false;
                }

                // 验证必要字段
                for (const field of fields) {
                    if (!memory[section].hasOwnProperty(field)) {
                        console.error(`${section} 缺少字段: ${field}`);
                        return false;
                    }
                }
            }

            return true;
        } catch (error) {
            console.error('验证记忆结构时出错:', error);
            return false;
        }
    }

    loadBackupMemory() {
        try {
            // 可以从IndexedDB或其他备份位置加载
            const backup = localStorage.getItem(this.storageKey + '_backup');
            return backup ? JSON.parse(backup) : null;
        } catch (error) {
            console.error('加载备份记忆失败:', error);
            return null;
        }
    }

    // 保存记忆
    saveMemory() {
        try {
            // 添加数据验证
            if (!this.validateMemoryStructure(this.memory)) {
                console.error('记忆数据结构无效');
                return false;
            }

            // 准备保存数据
            const saveData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                data: {
                    ...this.memory,
                    lastSaved: new Date().toISOString()
                }
            };

            // 保存前先创建备份
            this.createBackup();

            // 保存并验证
            const serialized = JSON.stringify(saveData);
            localStorage.setItem(this.storageKey, serialized);
            
            // 验证保存结果
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData || savedData !== serialized) {
                throw new Error('保存验证失败');
            }

            this.lastSavedMemory = serialized; // 更新最后保存的状态
            return true;
        } catch (error) {
            console.error('保存记忆失败:', error);
            return false;
        }
    }

    // 添加数据校验
    calculateChecksum(data) {
        return typeof data === 'object' ? 
            JSON.stringify(data).split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0) : 0;
    }

    // 更新用户信息
    updatePersonalInfo(info) {
        // 添加数据验证
        if (!this.validatePersonalInfo(info)) {
            console.error('个人信息格式无效');
            return false;
        }
        
        // 添加变更日志
        const changes = this.trackChanges(this.memory.personalInfo, info);
        if (Object.keys(changes).length > 0) {
            this.logChanges('personalInfo', changes);
        }
        
        // 更新信息
        this.memory.personalInfo = { 
            ...this.memory.personalInfo, 
            ...info,
            lastUpdated: new Date().toISOString()
        };
        
        return this.saveMemory();
    }

    validatePersonalInfo(info) {
        const validators = {
            birthday: (val) => /^\d{4}年\d{1,2}月\d{1,2}[日号]$/.test(val),
            age: (val) => Number.isInteger(Number(val)) && Number(val) > 0,
            phone: (val) => /^\d{11}$/.test(val)
        };
        
        // 需要添加更多验证规则
        const additionalValidators = {
            name: (val) => val && val.length >= 2 && val.length <= 20,
            zodiac: (val) => ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', 
                             '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'].includes(val),
            bloodType: (val) => /^(A|B|O|AB)[+-]?$/.test(val)
        };

        Object.assign(validators, additionalValidators);
        
        return Object.entries(info).every(([key, value]) => {
            if (!value) return true; // 跳过空值
            if (validators[key]) {
                const isValid = validators[key](value);
                if (!isValid) {
                    console.error(`${key} 格式无效:`, value);
                }
                return isValid;
            }
            return true;
        });
    }

    trackChanges(oldData, newData) {
        const changes = {};
        Object.keys(newData).forEach(key => {
            if (oldData[key] !== newData[key]) {
                changes[key] = {
                    from: oldData[key],
                    to: newData[key]
                };
            }
        });
        return changes;
    }

    // 分析并提取个人信息
    analyzePersonalInfo(message) {
        const patterns = {
            birthday: [
                /我的生日是?([0-9]{4}年)?([0-9]{1,2}月[0-9]{1,2}[日号])/,
                /([0-9]{1,2}月[0-9]{1,2}[日号]).*生日/,
                /生日.*([0-9]{1,2}月[0-9]{1,2}[日号])/,
                /出生于?([0-9]{4}年)?([0-9]{1,2}月[0-9]{1,2}[日号])/,
                /([0-9]{1,2})[.月]([0-9]{1,2})[日号]?/,
                /生日是?([0-9]{1,2})[.月]([0-9]{1,2})/
            ],
            age: [
                /我.*?([0-9]{1,3}).*岁/,
                /([0-9]{1,3}).*岁.*年龄/
            ],
            name: [
                /我(的名字|叫|是)[\s\S]{1,2}([^，。！？,!?]{2,4})/,
                /([^，。！？,!?]{2,4}).*是我的名字/
            ],
            // 身体信息
            height: [
                /我.*?([0-9]{2,3}).*?(米|cm|CM)/,
                /身高.*?([0-9]{2,3})/
            ],
            weight: [
                /我.*?([0-9]{2,3}).*?(公斤|kg|KG)/,
                /体重.*?([0-9]{2,3})/
            ],
            bloodType: [
                /我是(A|B|O|AB)型血/,
                /血型.*(A|B|O|AB)型/
            ],
            // 工作信息
            occupation: [
                /我是(一[名]|做)?([^，。！？,!?]{2,10})(工)?的/,
                /我(在|目前|现在)是([^，。！？,!?]{2,10})/
            ],
            company: [
                /我在([^，。！？,!?]{2,20})(?:公司|企业|单位)(?:上班|工作)/,
                /([^，。！？,!?]{2,20})(?:公司|企业|单位).*工作/
            ],
            // 教育信
            education: [
                /(是|在)([^，。！？,!?]{2,15})(毕业|学生|读书|在读)/,
                /(毕业|就读)于([^，。！？,!?]{2,15})/
            ],
            school: [
                /我(在|是)?([^，。！？,!?]{2,15})(大学|学院|学校)/,
                /([^，。！？,!?]{2,15})(大学|学院|学校).*?(毕业|在读)/
            ],
            major: [
                /我的是([^，。！？,!?]{2,15})/,
                /专业是([^，。！？,!?]{2,15})/
            ],
            // 地址信息
            address: [
                /我住在([^，。！？,!?]{3,20})/,
                /地([^，。！？,!?]{3,20})/,
                /([^，。！？,!?]{3,20}).*这里住/
            ],
            hometown: [
                /我是([^，。！？,!?]{2,10})人/,
                /老家在([^，。！？,!?]{2,10})/,
                /家乡是([^，。！？,!?]{2,10})/
            ],
            // 联系方式
            phone: [
                /我是([0-9-]{8,13})/,
                /联系方式是([0-9-]{8,13})/
            ],
            email: [
                /邮箱是([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
                /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}).*邮箱/
            ]
        };

        let extracted = {};
        
        // 遍历所有模式进行匹配
        Object.entries(patterns).forEach(([key, patternList]) => {
            patternList.some(pattern => {
                const match = message.match(pattern);
                if (match) {
                    extracted[key] = match[match.length - 1].trim();
                    return true;
                }
                return false;
            });
        });

        // 析兴趣爱好
        const hobbyPatterns = [
            /我(喜欢|爱)([^，。！？,!?]{2,20})/,
            /我(最爱|特别喜欢)([^，。！？,!?]{2,20})/
        ];

        hobbyPatterns.forEach(pattern => {
            const match = message.match(pattern);
            if (match) {
                const hobby = match[2].trim();
                if (!this.memory.personalInfo.hobbies.includes(hobby)) {
                    this.memory.personalInfo.hobbies.push(hobby);
                }
            }
        });

        // 分析情感状态
        const emotion = this.analyzeEmotion(message);
        if (emotion) {
            this.updateEmotionalState(emotion);
        }

        return extracted;
    }

    // 分析情感状态
    analyzeEmotion(message) {
        let maxEmotionScore = 0;
        let dominantEmotion = null;

        Object.entries(this.emotionKeywords).forEach(([emotion, keywords]) => {
            const score = keywords.reduce((count, keyword) => {
                return count + (message.includes(keyword) ? 1 : 0);
            }, 0);

            if (score > maxEmotionScore) {
                maxEmotionScore = score;
                dominantEmotion = emotion;
            }
        });

        return dominantEmotion;
    }

    // 更新情感状态
    updateEmotionalState(emotion) {
        const timestamp = new Date().toISOString();
        this.memory.personalInfo.emotional_state.current = emotion;
        this.memory.personalInfo.emotional_state.history.push({
            emotion,
            timestamp
        });

        // 保持历史记录在合理范围内
        if (this.memory.personalInfo.emotional_state.history.length > 50) {
            this.memory.personalInfo.emotional_state.history.shift();
        }

        // 更新情绪触发因素
        this.memory.personalInfo.emotional_state.triggers[emotion] = 
            (this.memory.personalInfo.emotional_state.triggers[emotion] || 0) + 1;
    }

    // 分析重要日期
    analyzeImportantDates(message) {
        const datePatterns = {
            anniversary: [
                /纪念日是?([0-9]{4}年)?([0-9]{1,2}月[0-9]{1,2}[日])/,
                /([0-9]{1,2}月[0-9]{1,2}[日号]).*纪念日/
            ],
            special_days: [
                /([^，。！？,!?]{2,10})日是?([0-9]{4}年)?([0-9]{1,2}月[0-9]{1,2}[日号])/
            ]
        };

        let dates = {};
        
        Object.entries(datePatterns).forEach(([key, patterns]) => {
            patterns.some(pattern => {
                const match = message.match(pattern);
                if (match) {
                    if (key === 'special_days') {
                        const eventName = match[1];
                        const date = match[match.length - 1];
                        dates[key] = dates[key] || {};
                        dates[key][eventName] = date;
                    } else {
                        dates[key] = match[match.length - 1];
                    }
                    return true;
                }
                return false;
            });
        });

        return dates;
    }

    // 记录重要对话
    recordConversation(message, isImportant = false) {
        const timestamp = new Date().toISOString();
        const conversation = { timestamp, content: message, isImportant };

        // 分析并更新个人信息
        const personalInfo = this.analyzePersonalInfo(message);
        if (Object.keys(personalInfo).length > 0) {
            console.log('取到个人信息:', personalInfo); // 添加日志
            const updateResult = this.updatePersonalInfo(personalInfo);
            if (!updateResult) {
                console.error('个人信息更新失败');
            }
            isImportant = true;
        }

        // 更新统计信息
        this.memory.statistics.total_conversations++;
        this.memory.conversations.last_conversation = timestamp;

        // 保存对话记录
        this.memory.conversations.shared_memories.push({
            ...conversation,
            extractedInfo: personalInfo // 保存提取的信息
        });

        // 立保存更新
        return this.saveMemory();
    }

    // 分析对话主题
    analyzeTopics(message) {
        const topics = [];
        const topicKeywords = {
            '爱情': ['爱', '喜���', '想你', '想念', '动'],
            '生活': ['吃饭', '睡觉', '工作', '学习', '生活'],
            '心情': ['开心', '难过', '高兴', '伤心', '快乐'],
            '未来': ['将', '未来', '计划', '梦想', '希望']
        };

        Object.entries(topicKeywords).forEach(([topic, keywords]) => {
            if (keywords.some(keyword => message.includes(keyword))) {
                topics.push(topic);
            }
        });

        return topics;
    }

    // 更新亲密度
    updateIntimacy(value) {
        const oldLevel = this.getEmotionalState();
        this.memory.emotional_bonds.intimacy_level = Math.max(0, 
            Math.min(100, this.memory.emotional_bonds.intimacy_level + value));
        
        // 记录心情变化
        this.memory.emotional_bonds.mood_history.push({
            timestamp: new Date().toISOString(),
            old_level: oldLevel,
            new_level: this.getEmotionalState(),
            change: value
        });

        return this.saveMemory();
    }

    // 记录特殊互动
    recordInteraction(type, details) {
        const timestamp = new Date().toISOString();
        const interaction = { type, details, timestamp };
        
        // 更新统计信息
        this.memory.statistics.total_interactions++;
        const hour = new Date().getHours();
        this.memory.statistics.interaction_frequency[hour] = 
            (this.memory.statistics.interaction_frequency[hour] || 0) + 1;

        this.memory.emotional_bonds.special_interactions.push(interaction);
        return this.saveMemory();
    }

    // 获取记忆摘要
    getMemorySummary() {
        const now = new Date();
        const firstMeet = new Date(this.memory.personalInfo.first_meet);
        const daysKnown = Math.floor((now - firstMeet) / (1000 * 60 * 60 * 24));

        return {
            nickname: this.memory.personalInfo.nickname,
            intimacyLevel: this.memory.emotional_bonds.intimacy_level,
            daysKnown,
            recentMemories: this.memory.conversations.shared_memories.slice(-5),
            keyMoments: this.memory.conversations.key_moments,
            favoriteTopics: this.getFavoriteTopics(3),
            totalConversations: this.memory.statistics.total_conversations,
            totalInteractions: this.memory.statistics.total_interactions
        };
    }

    // 获取最喜欢的话题
    getFavoriteTopics(count = 3) {
        return Object.entries(this.memory.statistics.favorite_topics)
            .sort(([,a], [,b]) => b - a)
            .slice(0, count)
            .map(([topic]) => topic);
    }

    // 导出记忆
    exportMemory() {
        return {
            data: this.memory,
            exportTime: new Date().toISOString(),
            version: '1.0'
        };
    }

    // 导入记忆
    importMemory(data) {
        try {
            if (!data.version || !data.data) {
                throw new Error('无效的记忆数据格式');
            }
            this.memory = data.data;
            return this.saveMemory();
        } catch (error) {
            console.error('导入记忆失败:', error);
            return false;
        }
    }

    // 清除记忆
    clearMemory() {
        try {
            localStorage.removeItem(this.storageKey);
            this.memory = this.getInitialMemory();
            return true;
        } catch (error) {
            console.error('清除记忆失败:', error);
            return false;
        }
    }

    // 获取情感状态
    getEmotionalState() {
        const intimacy = this.memory.emotional_bonds.intimacy_level;
        if (intimacy >= 80) return '深深的爱';
        if (intimacy >= 60) return '亲密';
        if (intimacy >= 40) return '友好';
        if (intimacy >= 20) return '熟悉';
        return '初识';
    }

    // 获取活跃时间分析
    getActiveTimeAnalysis() {
        const frequency = this.memory.statistics.interaction_frequency;
        const mostActiveHour = Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)[0];
        return {
            mostActiveHour: mostActiveHour ? parseInt(mostActiveHour[0]) : null,
            frequency
        };
    }

    // 获取个人信息摘要
    getPersonalInfoSummary() {
        const info = this.memory.personalInfo;
        const summary = [];

        // 基本信息
        if (info.name) summary.push(`姓名：${info.name}`);
        if (info.age) summary.push(`年龄：${info.age}`);
        if (info.birthday) summary.push(`生日：${info.birthday}`);
        if (info.zodiac) summary.push(`星：${info.zodiac}`);
        if (info.bloodType) summary.push(`血型：${info.bloodType}`);
        
        // 身体信息
        if (info.height) summary.push(`身高：${info.height}`);
        if (info.weight) summary.push(`体重：${info.weight}`);

        // 工作教育
        if (info.occupation) summary.push(`职业：${info.occupation}`);
        if (info.company) summary.push(`公司：${info.company}`);
        if (info.education) summary.push(`学历：${info.education}`);
        if (info.school) summary.push(`学校：${info.school}`);
        if (info.major) summary.push(`专业：${info.major}`);

        // 地址信息
        if (info.address) summary.push(`地址：${info.address}`);
        if (info.hometown) summary.push(`家乡：${info.hometown}`);

        // 兴趣爱好
        if (info.hobbies.length > 0) {
            summary.push(`兴趣爱好：${info.hobbies.join('、')}`);
        }

        // 重日期
        const dates = info.important_dates;
        if (dates.anniversary) summary.push(`纪念日：${dates.anniversary}`);
        if (dates.graduation) summary.push(`毕业日期：${dates.graduation}`);
        if (dates.work_anniversary) summary.push(`工作周年：${dates.work_anniversary}`);
        if (dates.special_days && Object.keys(dates.special_days).length > 0) {
            Object.entries(dates.special_days).forEach(([event, date]) => {
                summary.push(`${event}：${date}`);
            });
        }

        // 情感状态
        if (info.emotional_state.current) {
            summary.push(`当前心情：${this.translateEmotion(info.emotional_state.current)}`);
        }

        return summary.join('\n');
    }

    // 翻译情感状态
    translateEmotion(emotion) {
        const translations = {
            happy: '开心',
            sad: '难过',
            angry: '生气',
            anxious: '焦虑',
            tired: '疲惫',
            lonely: '寂寞',
            love: '充满爱意'
        };
        return translations[emotion] || emotion;
    }

    // 获取关系报告
    getRelationshipReport() {
        const summary = this.getMemorySummary();
        const activeTime = this.getActiveTimeAnalysis();
        const personalInfo = this.getPersonalInfoSummary();
        
        return {
            duration: `我们经认识 ${summary.daysKnown} 天了`,
            intimacy: `当前关系：${this.getEmotionalState()}`,
            personalInfo: personalInfo ? `\n个人信息：\n${personalInfo}` : '',
            interactions: `共有 ${summary.totalConversations} 次对话和${summary.totalInteractions} 次互动`,
            favoriteTopics: `最喜欢聊的话题：${summary.favoriteTopics.join('、')}`,
            activeTime: activeTime.mostActiveHour !== null ? 
                `最活跃的时间是 ${activeTime.mostActiveHour} 点` : 
                '还在了解你的作息时间'
        };
    }

    // 添加记忆优先级属性
    prioritizeMemory(memoryType, content) {
        return {
            priority: this.calculatePriority(memoryType, content),
            timestamp: new Date().toISOString(),
            content: content,
            type: memoryType
        };
    }

    calculatePriority(type, content) {
        // 基于类型和内容计算优先级
        let priority = 0;
        switch(type) {
            case 'personal_info':
                priority = 5;
                break;
            case 'emotional':
                priority = 4;
                break;
            case 'daily_conversation':
                priority = 2;
                break;
            // ...
        }
        return priority;
    }

    // 添加记忆衰减方法
    applyMemoryDecay() {
        const now = new Date();
        this.memory.conversations.shared_memories = 
            this.memory.conversations.shared_memories.filter(memory => {
                const age = (now - new Date(memory.timestamp)) / (1000 * 60 * 60 * 24);
                const decayThreshold = memory.priority * 30; // 基于优先级的保存天数
                return age <= decayThreshold;
            });
    }

    // 添加记忆关联方法
    createMemoryAssociation(memory1, memory2, associationType) {
        if (!this.memory.associations) {
            this.memory.associations = [];
        }
        
        this.memory.associations.push({
            memory1Id: memory1.id,
            memory2Id: memory2.id,
            type: associationType,
            strength: 1,
            timestamp: new Date().toISOString()
        });
    }

    // 建议添加备份机制
    backupMemory() {
        const backup = {
            timestamp: new Date().toISOString(),
            data: this.memory,
            version: '1.0'
        };
        
        // 可以选择存到IndexedDB或发送到服务器
        this.saveToBackupStorage(backup);
    }

    // 建议添加压缩制
    compressMemory() {
        // 合并相记忆
        this.mergeSimilarMemories();
        
        // 清理过期数据
        this.cleanExpiredData();
        
        // 压缩存储
        this.compressStorage();
    }

    mergeSimilarMemories() {
        // 使用相似度算法合并相近的记忆
        const memories = this.memory.conversations.shared_memories;
        // ...实现记忆合并逻辑
    }

    // 建议添加索引机制
    createMemoryIndex() {
        this.memoryIndex = {
            topics: new Map(),
            dates: new Map(),
            emotions: new Map()
        };
        
        this.memory.conversations.shared_memories.forEach(memory => {
            // 建立索引
            this.indexMemory(memory);
        });
    }

    // 添加版本检方法
    needsUpgrade(version) {
        const currentVersion = '1.0'; // 当前系统版本
        return version && version !== currentVersion;
    }

    // 添加升级结构方法
    upgradeMemoryStructure(oldMemory) {
        // 根据版本进行结构升级
        const newMemory = this.getInitialMemory();
        
        try {
            // 保留旧数据
            if (oldMemory.personalInfo) {
                newMemory.personalInfo = {
                    ...newMemory.personalInfo,
                    ...oldMemory.personalInfo
                };
            }
            
            if (oldMemory.conversations) {
                newMemory.conversations = {
                    ...newMemory.conversations,
                    ...oldMemory.conversations
                };
            }
            
            // 添加字段的默认值
            return newMemory;
        } catch (error) {
            console.error('记忆结构升级失败:', error);
            return this.getInitialMemory();
        }
    }

    validateMemoryStructure(memory) {
        const requiredFields = [
            'personalInfo',
            'conversations',
            'emotional_bonds',
            'statistics'
        ];
        
        try {
            // 检查要字段
            const isValid = requiredFields.every(field => 
                memory && typeof memory[field] === 'object'
            );
            
            if (!isValid) {
                console.warn('记忆结构不完整，重新初始化');
                return false;
            }
            
            // 检查关键子字段
            if (!memory.personalInfo.emotional_state || 
                !Array.isArray(memory.conversations.shared_memories)) {
                console.warn('记忆子结构不完整，重新初始化');
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('记忆结构验证失败:', error);
            return false;
        }
    }

    setupAutoSave() {
        // 定期检查并保存
        setInterval(() => {
            if (this.hasMemoryChanged()) {
                console.log('检测到记忆变化，自动保存');
                this.saveMemory();
            }
        }, 30000); // 每30秒检查一次

        // 页面关闭前保存
        window.addEventListener('beforeunload', () => {
            if (this.hasMemoryChanged()) {
                console.log('页面关闭前保存记忆');
                this.saveMemory();
            }
        });
    }

    hasMemoryChanged() {
        const currentMemory = JSON.stringify(this.memory);
        return this.lastSavedMemory !== currentMemory;
    }

    // 添加数据加密存储
    encryptMemory(data) {
        // 使用加密算法保护敏感信息
        return encryptedData;
    }
    
    // 添加存储配额管理
    async checkStorageQuota() {
        try {
            const quota = navigator.storage && navigator.storage.estimate ?
                await navigator.storage.estimate() : null;
            return quota;
        } catch (error) {
            console.error('存储配额检查失败:', error);
            return null;
        }
    }

    // 添加敏感信息处理
    sanitizePersonalInfo(info) {
        const sensitiveFields = ['phone', 'email', 'address'];
        const sanitized = {...info};
        
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = this.maskSensitiveData(sanitized[field]);
            }
        });
        
        return sanitized;
    }
    
    // 添加访问控制
    checkAccessPermission(operation) {
        // 检查操作权限
        return this.accessControl[operation] || false;
    }

    // 添加分页载机制
    loadMemoriesByPage(page, size) {
        const start = page * size;
        const end = start + size;
        return this.memory.conversations.shared_memories.slice(start, end);
    }
    
    // 添加缓存机制
    cacheFrequentQueries() {
        this.queryCache = new Map();
        // 缓存常用查询结果
    }

    // 添加错误处理中心
    handleError(error, context) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: error.message,
            context,
            stack: error.stack
        };
        
        this.logError(errorLog);
        this.notifyUser(error.message);
        
        return this.attemptRecovery(context);
    }
    
    // 添加错误恢复机
    attemptRecovery(context) {
        switch(context) {
            case 'load':
                return this.loadBackupMemory();
            case 'save':
                return this.retryWithCompression();
            default:
                return null;
        }
    }

    // 添加状态管理
    updateStatus(status) {
        this.status = status;
        this.notifyStatusChange(status);
    }
    
    // 添加操作反馈
    provideFeedback(operation, result) {
        return {
            success: result.success,
            message: result.message,
            timestamp: new Date().toISOString(),
            details: result.details
        };
    }

    // 添加存储验证方法
    verifyStoredInfo() {
        const info = this.memory.personalInfo;
        console.log('当前存储的个人信息:', info); // 添加日志
        
        // 验证关键信息否正确存储
        const criticalFields = ['birthday', 'name', 'age'];
        criticalFields.forEach(field => {
            if (info[field]) {
                console.log(`${field}: ${info[field]}`);
            } else {
                console.log(`${field} 未设置`);
            }
        });
    }

    // 添加信息确认方法
    confirmPersonalInfo(info) {
        // 生成确认消息
        const confirmMessage = Object.entries(info)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        
        console.log('需要确认的信息:', confirmMessage);
        
        // 这里可以添加用户确认机制
        return true; // 或者等待用户确认
    }

    // 添加自动备份
    setupAutoBackup() {
        const backupInterval = 24 * 60 * 60 * 1000; // 24小时
        setInterval(() => {
            this.createBackup();
        }, backupInterval);
    }

    createBackup() {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                version: '1.0',
                data: this.memory
            };
            
            localStorage.setItem(
                `${this.storageKey}_backup_${backup.timestamp}`, 
                JSON.stringify(backup)
            );
            
            this.cleanupOldBackups();
            return true;
        } catch (error) {
            console.error('创建备份失败:', error);
            return false;
        }
    }

    cleanupOldBackups() {
        const maxBackups = 7; // 保留最近7天的备份
        const backupKeys = Object.keys(localStorage)
            .filter(key => key.startsWith(`${this.storageKey}_backup_`))
            .sort()
            .reverse();
        
        if (backupKeys.length > maxBackups) {
            backupKeys.slice(maxBackups).forEach(key => {
                localStorage.removeItem(key);
            });
        }
    }

    // 建议添加
    updateMemory(type, data) {
        // 记录更新
        const updateLog = {
            type,
            timestamp: new Date().toISOString(),
            data
        };
        
        // 触发更新事件
        this.notifyMemoryUpdate(updateLog);
        
        // 更新索引
        this.memoryIndex.indexMemory(data);
    }

    notifyMemoryUpdate(updateLog) {
        // 通知其他组件记忆已更新
        const event = new CustomEvent('memoryUpdate', {
            detail: updateLog
        });
        document.dispatchEvent(event);
    }

    // 在类中添加调试方法
    debugMemory() {
        console.log('当前记忆状态:', {
            personalInfo: this.memory.personalInfo,
            conversationsCount: this.memory.conversations.shared_memories.length,
            lastConversation: this.memory.conversations.last_conversation,
            emotionalBonds: this.memory.emotional_bonds,
            statistics: this.memory.statistics
        });
    }
}

// 添加记忆索引
class MemoryIndex {
    constructor() {
        this.topicIndex = new Map();
        this.dateIndex = new Map();
        this.emotionIndex = new Map();
    }
    
    indexMemory(memory) {
        // 索引主题、日期和情感
        // ...
    }
}

// 建议添加
class MemoryLoadingState {
    constructor() {
        this.status = 'idle';
        this.error = null;
        this.progress = 0;
    }
    
    setLoading() {
        this.status = 'loading';
        this.notifyStateChange();
    }
    
    setComplete() {
        this.status = 'complete';
        this.notifyStateChange();
    }
    
    setError(error) {
        this.status = 'error';
        this.error = error;
        this.notifyStateChange();
    }
    
    notifyStateChange() {
        // 通知UI更新加载状态
    }
} 