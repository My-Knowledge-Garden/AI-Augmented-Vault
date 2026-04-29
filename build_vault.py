import os
import re
from datetime import datetime

# اسم المستودع (Vault Name)
vault_name = "AI-Augmented-Vault"

# الهيكلية الكاملة
structure = {
    "1-creative-production": {
        "display": "1. Creative Production (الإنتاج الإبداعي)",
        "subs": {
            "audio-generation": {
                "display": "Audio Generation (توليد الصوت)",
                "items": {
                    "songwriting": ("Songwriting (كتابة الأغاني)", "كتابة وتأليف كلمات الأغاني."),
                    "ai-music": ("AI-Generated Music (إنتاج موسيقي معزز بالذكاء الاصطناعي)", "توليد الموسيقى والألحان باستخدام أدوات الذكاء الاصطناعي.")
                }
            },
            "visual-arts": {
                "display": "Visual Arts (الفنون البصرية)",
                "items": {
                    "video-creation": ("Video Creation (إنشاء فيديوهات)", "عمليات مونتاج وإنتاج المحتوى المرئي."),
                    "3d-design": ("Hybrid 3D Design (تصميم ثلاثي الأبعاد بين الفن والهندسة)", "التصميم الثلاثي الأبعاد الذي يجمع الجمالية بالدقة الهندسية.")
                }
            }
        }
    },
    "2-radical-discourse": {
        "display": "2. Radical Discourse (الخطاب الراديكالي)",
        "subs": {
            "analytical-writing": {
                "display": "Analytical Writing (تدوين تحليلي)",
                "items": {
                    "political-economic-critique": ("Political & Economic Critique (نقد سياسي واقتصادي)", "تحليلات نقدية عميقة للنظم السياسية والاقتصادية."),
                    "religious-analysis": ("Religious Analysis (تحليل ديني)", "دراسات وتحليلات دينية برؤية واقعية.")
                }
            },
            "philosophical-framework": {
                "display": "Philosophical Framework (الإطار الفلسفي)",
                "items": {
                    "realistic-philosophy": ("Realistic Philosophy (الفلسفة الواقعية)", "التدوين المرتبط بالفلسفة الواقعية وتطبيقاتها."),
                    "radical-perspectives": ("Radical Perspectives (رؤى راديكالية)", "تطوير الرؤى الراديكالية حول القضايا المختلفة.")
                }
            }
        }
    },
    "3-practical-tech": {
        "display": "3. Practical Tech Solutions (حلول تقنية عملية)",
        "subs": {
            "software-building": {
                "display": "Software Building (بناء البرمجيات)",
                "items": {
                    "automation-scripts": ("Automation Scripts (سكربتات الأتمتة)", "برمجة سكربتات لتسهيل المهام المتكررة."),
                    "simple-web-pages": ("Simple Web Pages (صفحات ويب بسيطة)", "بناء واجهات ويب وتطبيقات بسيطة."),
                    "ai-development": ("AI-Enabled Development (تطوير معزز بأدوات الذكاء الاصطناعي)", "استخدام الذكاء الاصطناعي لرفع كفاءة البناء البرمجي.")
                }
            },
            "maintenance": {
                "display": "Maintenance (الصيانة)",
                "items": {
                    "hardware-repair": ("Tech Hardware Repair (إصلاح الأجهزة التقنية)", "سجلات إصلاح وصيانة العتاد التقني."),
                    "home-repairs": ("Home Appliance Fixes (إصلاحات منزلية)", "صيانة وإصلاح الأجهزة المنزلية المختلفة.")
                }
            }
        }
    },
    "4-knowledge-management": {
        "display": "4. Knowledge Management (إدارة المعرفة)",
        "subs": {
            "experimental-infrastructure": {
                "display": "Experimental Infrastructure (بنية تحتية تجريبية)",
                "items": {
                    "knowledge-tree": ("Experimental Knowledge Tree (شجرة معرفة قيد التجربة)", "بناء وهيكلة شجرة المعرفة الشخصية."),
                    "second-brain": ("Digital Second Brain (العقل الثاني الرقمي)", "إدارة وتطوير نظام العقل الثاني.")
                }
            },
            "information-synthesis": {
                "display": "Information Synthesis (تخليق المعلومات)",
                "items": {
                    "trial-error-structuring": ("Trial & Error Structuring (الهيكلة القائمة على التجربة والخطأ)", "منهجية تنظيم المعلومات من خلال التجربة والممارسة.")
                }
            }
        }
    }
}

def create_clean_vault(base_path, data):
    for main_key, main_val in data.items():
        # إنشاء مجلد القسم الرئيسي (مثلاً: 1-creative-production)
        main_path = os.path.join(base_path, main_key)
        os.makedirs(main_path, exist_ok=True)
        
        for sub_key, sub_val in main_val['subs'].items():
            # إنشاء مجلد التصنيف الفرعي (مثلاً: audio-generation)
            sub_path = os.path.join(main_path, sub_key)
            os.makedirs(sub_path, exist_ok=True)
            
            for item_key, (full_name, desc) in sub_val['items'].items():
                # إنشاء مجلد الموضوع (مثلاً: songwriting)
                item_path = os.path.join(sub_path, item_key)
                os.makedirs(item_path, exist_ok=True)
                
                # إنشاء ملف Markdown باسم بسيط وموحد (index.md) أو اسم الموضوع البسيط
                file_path = os.path.join(item_path, f"{item_key}.md")
                
                content = f"""---
title: "{full_name}"
category: "{sub_val['display']}"
parent: "{main_val['display']}"
description: "{desc}"
tags: [auto-generated, {main_key.split('-', 1)[1]}]
date: "{datetime.now().strftime('%Y-%m-%d')}"
progress: "in-progress"
public: false
status: "active"
---

# {full_name}

> {desc}

---
## Notes
- 
"""
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Success: {main_key} -> {sub_key} -> {item_key}")

if __name__ == "__main__":
    create_clean_vault(vault_name, structure)
    print("\n[DONE] Vault structure created successfully with clean paths.")
